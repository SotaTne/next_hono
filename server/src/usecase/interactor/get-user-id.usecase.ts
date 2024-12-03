import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import { HTTPException } from "hono/http-exception";
import { IGetUserIdUsecase } from "../interface/get-user-id.usecase.interface";

@injectable()
export class GetUserIdUsecase implements IGetUserIdUsecase {
  constructor(
    @inject(SessionCookieInfra)
    private readonly sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private readonly sessionStoreInfra: ISessionStoreInfra,
  ) {}
  async exec(c: Context): Promise<string> {
    await this.sessionStoreInfra.initPrisma(c);
    const sessionId = this.sessionCookieInfra.getSessionCookie(c);
    if (!sessionId) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const isExistSession =
      await this.sessionStoreInfra.isExistSession(sessionId);
    if (!isExistSession) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    this.sessionCookieInfra.updateSessionExpires({ sessionId, c });
    await this.sessionStoreInfra.updateSessionExpires(sessionId);

    const userId = await this.sessionStoreInfra.getUserIdBySession(sessionId);
    if (!userId) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
    return userId;
  }
}
