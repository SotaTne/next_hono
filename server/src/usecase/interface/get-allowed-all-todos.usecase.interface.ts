import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import { Context } from "hono";

export interface IGetAllowedAllTodosUsecase {
  exec(c: Context): Promise<TodoEntity[]>;
}
