import { HTTPException } from "hono/http-exception";
import { MiddlewareHandler } from "hono/types";

export function getDiscordEmail(): MiddlewareHandler {
  const discordMeURL = "https://discordapp.com/api/users/@me";
  return async (c, next) => {
    const discordToken = c.get("token");
    const discordUser = c.get("user-discord");
    if (
      !discordToken ||
      !discordUser ||
      (discordToken.expires_in ? discordToken.expires_in > Date.now() : true)
    ) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
    const fetcher = await fetch(discordMeURL, {
      headers: {
        Authorization: `Bearer ${discordToken.token}`,
      },
    });
    if (!fetcher.ok) {
      throw new HTTPException(401, {
        message: "Unauthorized discord api error",
      });
    }
    const discordUserData = await fetcher.json();
    if (typeof discordUserData.email !== "string" || !discordUserData.id) {
      throw new HTTPException(401, {
        message: "Unauthorized discord api entity error",
      });
    }
    if (!discordUser.id || discordUser.id !== discordUserData.id) {
      throw new HTTPException(401, {
        message: "Unauthorized discord id mismatch",
      });
    }
    c.set("discord-email", discordUserData.email);

    await next();
  };
}

declare module "hono" {
  interface ContextVariableMap {
    "discord-email": Partial<string> | undefined;
  }
}
