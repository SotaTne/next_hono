import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import { Context } from "hono";

export interface IGetTodoByIdUsecase {
  exec({ id, c }: { id: string; c: Context }): Promise<TodoEntity>;
}
