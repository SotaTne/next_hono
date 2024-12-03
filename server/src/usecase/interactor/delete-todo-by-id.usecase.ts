import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import type { ITodoInfra } from "@server/src/domain/interface/db/todo.infra.interface";
import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import { TodoInfra } from "@server/src/infra/db/todo.infra";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteTodoByIdUsecase {
  constructor(
    @inject(TodoInfra)
    private readonly todoInfra: ITodoInfra,
    @inject(SessionCookieInfra)
    private readonly sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private readonly sessionStoreInfra: ISessionStoreInfra,
  ) {}
  async deleteTodoById({ todoId, c }: { todoId: string; c: Context }) {
    await this.todoInfra.initPrisma(c);
    await this.sessionStoreInfra.initPrisma(c);
    let userId: string | undefined = undefined;
    const sessionId = this.sessionCookieInfra.getSessionCookie(c);
    if (sessionId) {
      const isExistSession =
        await this.sessionStoreInfra.isExistSession(sessionId);
      if (isExistSession) {
        this.sessionCookieInfra.updateSessionExpires({ sessionId, c });
        await this.sessionStoreInfra.updateSessionExpires(sessionId);

        userId =
          (await this.sessionStoreInfra.getUserIdBySession(sessionId)) ??
          undefined;
      }
    }
    return this.todoInfra.deleteTodo({
      todoId,
      userId,
    });
  }
}
