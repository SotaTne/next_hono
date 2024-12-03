import { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import { maxAge, sessionIdName } from "@server/src/public/session";
import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { injectable } from "tsyringe";

@injectable()
export class SessionCookieInfra implements ISessionCookieInfra {
  setSessionCookie({ sessionId, c }: { sessionId: string; c: Context }): void {
    console.log("setSessionCookie");
    setCookie(c, sessionIdName, sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge,
    });
  }
  getSessionCookie(c: Context): string | null {
    return getCookie(c, sessionIdName) ?? null;
  }
  deleteSessionCookie(c: Context): void {
    setCookie(c, sessionIdName, "", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 0,
    });
  }
  updateSessionExpires({
    sessionId,
    c,
  }: {
    sessionId: string;
    c: Context;
  }): void {
    setCookie(c, sessionIdName, sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge,
    });
  }
}
