import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import { Context } from "hono";

export interface ICreateTodoUseCase {
  exec({
    title,
    creator,
    isPrivate,
    c,
  }: {
    title: string;
    creator: string;
    isPrivate?: boolean;
    c: Context;
  }): Promise<TodoEntity>;
}
