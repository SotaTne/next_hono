import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import type { ITodoInfra } from "@server/src/domain/interface/db/todo.infra.interface";
import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import { TodoInfra } from "@server/src/infra/db/todo.infra";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";
import { ICreateTodoUseCase } from "../interface/create-todo.usecase.interface";

@injectable()
export class CreateTodoUseCase implements ICreateTodoUseCase {
  constructor(
    @inject(TodoInfra)
    private readonly todoInfra: ITodoInfra,
    @inject(SessionCookieInfra)
    private readonly sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private readonly sessionStoreInfra: ISessionStoreInfra,
  ) {}
  async exec({
    title,
    creator,
    isPrivate = false,
    c,
  }: {
    title: string;
    creator: string;
    isPrivate?: boolean;
    c: Context;
  }): Promise<TodoEntity> {
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
    const todo = await this.todoInfra.createTodo({
      title,
      creator,
      isPrivate,
      userId,
    });
    return todo;
  }
}
