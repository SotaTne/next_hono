import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import { IIsValidSessionUseCase } from "../interface/is-valid-session.usecase.interface";
import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";

@injectable()
export class IsValidSessionUseCase implements IIsValidSessionUseCase {
  constructor(
    @inject(SessionCookieInfra)
    private readonly sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private readonly sessionStoreInfra: ISessionStoreInfra,
  ) {}

  async exec(c: Context): Promise<boolean> {
    await this.sessionStoreInfra.initPrisma(c);
    const sessionId = this.sessionCookieInfra.getSessionCookie(c);
    if (!sessionId) {
      return false;
    }

    const isExistSession =
      await this.sessionStoreInfra.isExistSession(sessionId);
    if (!isExistSession) {
      return false;
    }

    this.sessionCookieInfra.updateSessionExpires({ sessionId, c });
    await this.sessionStoreInfra.updateSessionExpires(sessionId);

    return true;
  }
}
