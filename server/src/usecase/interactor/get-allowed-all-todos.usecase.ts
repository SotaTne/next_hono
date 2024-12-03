import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import type { ITodoInfra } from "@server/src/domain/interface/db/todo.infra.interface";
import { Context } from "hono";
import { IGetAllowedAllTodosUsecase } from "../interface/get-allowed-all-todos.usecase.interface";
import { inject, injectable } from "tsyringe";
import { TodoInfra } from "@server/src/infra/db/todo.infra";
import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";

@injectable()
export class GetAllowedAllTodosUsecase implements IGetAllowedAllTodosUsecase {
  constructor(
    @inject(TodoInfra)
    private readonly todoInfra: ITodoInfra,
    @inject(SessionCookieInfra)
    private readonly sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private readonly sessionStoreInfra: ISessionStoreInfra,
  ) {}
  async exec(c: Context): Promise<TodoEntity[]> {
    await this.sessionStoreInfra.initPrisma(c);
    await this.todoInfra.initPrisma(c);
    let userId: string | null = null;
    const sessionId = this.sessionCookieInfra.getSessionCookie(c);
    if (sessionId) {
      const isExistSession =
        await this.sessionStoreInfra.isExistSession(sessionId);
      if (isExistSession) {
        this.sessionCookieInfra.updateSessionExpires({ sessionId, c });
        await this.sessionStoreInfra.updateSessionExpires(sessionId);

        userId = await this.sessionStoreInfra.getUserIdBySession(sessionId);
      }
    }
    return await this.todoInfra.getAllowedAllTodos(userId);
  }
}
