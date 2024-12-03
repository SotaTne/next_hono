import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import type { ITodoInfra } from "@server/src/domain/interface/db/todo.infra.interface";
import { TodoInfra } from "@server/src/infra/db/todo.infra";
import { HTTPException } from "hono/http-exception";
import { inject, injectable } from "tsyringe";
import { Context } from "hono";
import { IGetTodoByIdUsecase } from "../interface/get-todo-by-id.usecase.interface";

@injectable()
export class GetTodoByIdUsecase implements IGetTodoByIdUsecase {
  constructor(
    @inject(TodoInfra)
    private readonly todoInfra: ITodoInfra,
  ) {}

  async exec({ id, c }: { id: string; c: Context }): Promise<TodoEntity> {
    await this.todoInfra.initPrisma(c);
    const todo = await this.todoInfra.getTodoById(id);

    if (!todo) {
      throw new HTTPException(404, {
        message: "Not Found",
      });
    }

    return todo;
  }
}
