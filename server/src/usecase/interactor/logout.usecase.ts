import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";
import { inject, injectable } from "tsyringe";
import { Context } from "hono";
import { ILogoutUseCase } from "../interface/logout.usecase.interface";

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    @inject(SessionCookieInfra)
    private sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private sessionStoreInfra: ISessionStoreInfra,
  ) {}
  async exec(c: Context): Promise<void> {
    await this.sessionStoreInfra.initPrisma(c);
    const sessionId = this.sessionCookieInfra.getSessionCookie(c);
    if (!sessionId) {
      return;
    }
    await this.sessionStoreInfra.deleteSession(sessionId);
    this.sessionCookieInfra.deleteSessionCookie(c);
  }
}
