import { TodoEntity } from "../../entity/todo.entity";
import { IDbAbstract } from "./db.abstract.interface";

export interface ITodoInfra extends IDbAbstract {
  getUserTodos(userId: string): Promise<TodoEntity[]>;
  getAllowedAllTodos(userId?: string | null): Promise<TodoEntity[]>;
  getTodoById(todoId: string): Promise<TodoEntity | null>;
  createTodo({
    userId,
    title,
    creator,
    isPrivate,
  }: {
    userId?: string | null;
    title: string;
    creator: string;
    isPrivate?: boolean | null;
  }): Promise<TodoEntity>;
  updateTodo({
    todoId,
    title,
    completed,
    isPrivate,
    userId,
  }: {
    todoId: string;
    title?: string | undefined;
    completed?: boolean | undefined;
    isPrivate?: boolean | undefined;
    userId?: string | undefined;
  }): Promise<TodoEntity>;
  deleteTodo({
    todoId,
    userId,
  }: {
    todoId: string;
    userId?: string | undefined;
  }): Promise<void>;
}
