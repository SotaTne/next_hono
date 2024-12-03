import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import { Context } from "vm";

export interface IGetTodosByUserIdUsecase {
  exec({ c, userId }: { c: Context; userId: string }): Promise<TodoEntity[]>;
}
