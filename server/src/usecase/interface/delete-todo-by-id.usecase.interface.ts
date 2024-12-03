import { Context } from "hono";

export interface IDeleteTodoByIdUsecase {
  exec({ todoId, c }: { todoId: string; c: Context }): Promise<void>;
}
