import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import { Context } from "hono";

export interface IEditTodoByIdUsecase {
  exec({
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
  }): Promise<TodoEntity>;
}
