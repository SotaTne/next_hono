import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import type { ITodoInfra } from "@server/src/domain/interface/db/todo.infra.interface";
import { TodoInfra } from "@server/src/infra/db/todo.infra";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";
import { IGetTodosByUserIdUsecase } from "../interface/get-todos-by-user-id.usecase.interface";

@injectable()
export class GetTodosByUserIdUsecase implements IGetTodosByUserIdUsecase {
  constructor(
    @inject(TodoInfra)
    private todoInfra: ITodoInfra,
  ) {}

  async exec({
    userId,
    c,
  }: {
    userId: string;
    c: Context;
  }): Promise<TodoEntity[]> {
    await this.todoInfra.initPrisma(c);
    return await this.todoInfra.getUserTodos(userId);
  }
}
