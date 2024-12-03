import { inject, injectable } from "tsyringe";
import { IBaseController } from "../base";
import { OpenAPIHono } from "@hono/zod-openapi";
import { googleAuth } from "@hono/oauth-providers/google";
import { discordAuth } from "@hono/oauth-providers/discord";
import type { IIsValidSessionUseCase } from "@server/src/usecase/interface/is-valid-session.usecase.interface";
import { IsValidSessionUseCase } from "@server/src/usecase/interactor/is-valid-session.usecase";
import type { ILoginWithProviderUseCase } from "@server/src/usecase/interface/login-with-provider.usecase.interface";
import { LoginWithProviderUseCase } from "@server/src/usecase/interactor/login-with-provider.usecase";
import { providers } from "@server/src/public/login";
import {
  oauthLoginDiscordRoute,
  oauthLoginGoogleRoute,
} from "./openapi/auth-controller.route";
import { getDiscordEmail } from "@server/src/public/newDiscordAuth";
import { LogoutUseCase } from "@server/src/usecase/interactor/logout.usecase";
import type { ILogoutUseCase } from "@server/src/usecase/interface/logout.usecase.interface";

/**
 * @class AuthController
 * @description /auth
 */
@injectable()
export class AuthController implements IBaseController {
  constructor(
    @inject(IsValidSessionUseCase)
    private isValidSessionUseCase: IIsValidSessionUseCase,
    @inject(LoginWithProviderUseCase)
    private loginUseCase: ILoginWithProviderUseCase,
    @inject(LogoutUseCase)
    private logoutUseCase: ILogoutUseCase,
  ) {}
  private serverApp = new OpenAPIHono();
  public route(): OpenAPIHono {
    this.serverApp.onError((err, c) => {
      console.error("Unhandled Error:", err);
      return c.text("Internal Server Error", 500);
    });

    // public route(session)
    this.serverApp.use("/login/*", async (c, next) => {
      if (await this.isValidSessionUseCase.exec(c)) {
        return c.redirect("/");
      }
      return next();
    });

    // google middleware
    this.serverApp.use(
      "/login/google",
      googleAuth({
        scope: ["openid", "profile", "email"],
      }),
    );

    // discord middleware
    this.serverApp.use(
      "/login/discord",
      discordAuth({
        scope: ["identify", "email"],
      }),
    );
    this.serverApp.use("/login/discord", getDiscordEmail());

    // google route
    this.serverApp.openapi(oauthLoginGoogleRoute, async (c) => {
      const user = c.get("user-google");
      if (!user || !user.email || !user.id || !user.name) {
        return c.json({
          status: 401,
          body: "Unauthorized",
        });
      }
      await this.loginUseCase.exec({
        email: user.email,
        providerUserId: user.id,
        name: user.name,
        providerId: providers.google,
        c,
      });
      return c.redirect("/");

    });

    // discord route
    this.serverApp.openapi(oauthLoginDiscordRoute, async (c) => {
      const user = c.get("user-discord");
      const email = c.get("discord-email");
      if (!user || !email || !user.id || !user.username) {
        return c.json({
          status: 401,
          body: "Unauthorized",
        });
      }
      await this.loginUseCase.exec({
        email,
        providerUserId: user.id,
        name: user.username,
        providerId: providers.discord,
        c,
      });
      return c.redirect("/");

    });

    // logout
    this.serverApp.get("/logout", (c) => {
      this.logoutUseCase.exec(c);
      return c.redirect("/login");

    });
    return this.serverApp;
  }
}
