import { Context } from "hono";

export interface ISessionCookieInfra {
  setSessionCookie({ sessionId, c }: { sessionId: string; c: Context }): void;
  getSessionCookie(c: Context): string | null;
  deleteSessionCookie(c: Context): void;
  updateSessionExpires({
    sessionId,
    c,
  }: {
    sessionId: string;
    c: Context;
  }): void;
}
