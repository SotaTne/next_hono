import { lucia } from "@server/src/infra/lucia/sqlite/lucia.sqlite";
import { googleAuth } from "@server/src/infra/auth/google.auth";
import { githubAuth } from "@server/src/infra/auth/github.auth";
import { ILogin } from "@server/src/domain/interface/login.interface";
import {
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
} from "arctic";
import { UserSessionEntity } from "@server/src/domain/entity/user-session.entity";
import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { injectable } from "tsyringe";
import {
  OAuthAccountTable,
  UserTable,
} from "@server/src/infra/database/db.base";
import { db } from "@server/src/infra/database/sqlite/db.sqlite";
import { randomUUID } from "crypto";

@injectable()
export class Login implements ILogin {
  async setGithubCookie(
    props: UserSessionEntity,
    c: Context,
  ): Promise<URL | null> {
    const state = generateState();
    let url: URL | null = null;
    if (props.providerId === "github") {
      const github = githubAuth();
      url = await github.createAuthorizationURL(state, ["user:email"]);
      setCookie(c, "github_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "Lax",
      });
    }
    return url;
  }
  async setGoogleCookie(
    props: UserSessionEntity,
    c: Context,
  ): Promise<URL | null> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    let url: URL | null = null;
    if (props.providerId === "google") {
      const google = googleAuth();
      url = await google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "email",
        "profile",
      ]);
      setCookie(c, "google_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "Lax",
      });
    }
    return url;
  }
  async githubLogin(
    props: UserSessionEntity,
    c: Context,
  ): Promise<"200" | "400" | "500"> {
    const code = c.req.query("code")?.toString() ?? null;
    const state = c.req.query("state")?.toString() ?? null;
    const storedState = getCookie(c).github_oauth_state ?? null;
    if (!code || !state || state !== storedState) {
      return "400";
    }
    try {
      const tokens = await githubAuth().validateAuthorizationCode(code);
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const json = await githubUserResponse.json();
      const id = json.id;
      const login = json.login;
      const email = json["user:email"];
      const existingUserAuth: OAuthAccountTable | null =
        (await db
          .selectFrom("oauth_account")
          .where("provider_id", "=", "github")
          .selectAll()
          .limit(1)
          .where("provider_user_id", "=", id)
          .executeTakeFirst()) ?? null;
      const existingUser: UserTable | null =
        existingUserAuth !== null
          ? ((await db
              .selectFrom("user")
              .where("id", "=", existingUserAuth?.user_id ?? "")
              .selectAll()
              .limit(1)
              .executeTakeFirst()) ?? null)
          : null;
      if (existingUserAuth && existingUser) {
        const session = await lucia.createSession(existingUserAuth.user_id, {});
        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          { append: true },
        );
        return "200";
      }
      const userId = randomUUID();
      db.transaction().execute(async (trx) => {
        trx.insertInto("user").values({
          id: userId,
          name: login,
        });
        trx.insertInto("oauth_account").values({
          provider_id: "github",
          provider_user_id: id,
          user_id: userId,
        });
      });
      const session = await lucia.createSession(userId, {});
      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        { append: true },
      );
      return "200";
    } catch (error) {
      if (
        error instanceof OAuth2RequestError &&
        error.message === "bad_verification_code"
      ) {
        // invalid code
        return "400";
      }
      return "500";
    }
  }
  async googleLogin(
    props: UserSessionEntity,
    c: Context,
  ): Promise<"200" | "400" | "500"> {
    const code = c.req.query("code")?.toString() ?? null;
    const state = c.req.query("state")?.toString() ?? null;
    const storedState = getCookie(c).google_oauth_state ?? null;
    if (!code || !state || state !== storedState) {
      return "400";
    }
  }
}
