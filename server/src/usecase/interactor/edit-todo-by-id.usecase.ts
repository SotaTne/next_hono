import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import type { ITodoInfra } from "@server/src/domain/interface/db/todo.infra.interface";
import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import { TodoInfra } from "@server/src/infra/db/todo.infra";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";
import { IEditTodoByIdUsecase } from "../interface/edit-todo-by-id.usecase.interface";
import { TodoEntity } from "@server/src/domain/entity/todo.entity";

@injectable()
export class EditTodoByIdUseCase implements IEditTodoByIdUsecase {
  constructor(
    @inject(TodoInfra)
    private readonly todoInfra: ITodoInfra,
    @inject(SessionCookieInfra)
    private readonly sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private readonly sessionStoreInfra: ISessionStoreInfra,
  ) {}

  async exec({
    id,
    title,
    isPrivate,
    completed,
    c,
  }: {
    id: string;
    title?: string | undefined;
    completed?: boolean | undefined;
    isPrivate?: boolean | undefined;
    c: Context;
  }): Promise<TodoEntity> {
    await this.todoInfra.initPrisma(c);
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
    return await this.todoInfra.updateTodo({
      todoId: id,
      completed,
      title,
      isPrivate,
      userId,
    });
  }
}
