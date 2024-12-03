import { inject, injectable } from "tsyringe";
import { IBaseController } from "../base";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { IGetTodosByUserIdUsecase } from "@server/src/usecase/interface/get-todos-by-user-id.usecase.interface";
import { GetTodosByUserIdUsecase } from "@server/src/usecase/interactor/get-todos-by-user-id.usecase";
import { GetUserIdUsecase } from "@server/src/usecase/interactor/get-user-id.usecase";
import type { IGetUserIdUsecase } from "@server/src/usecase/interface/get-user-id.usecase.interface";
import { GetAllowedAllTodosUsecase } from "@server/src/usecase/interactor/get-allowed-all-todos.usecase";
import type { IGetAllowedAllTodosUsecase } from "@server/src/usecase/interface/get-allowed-all-todos.usecase.interface";
import { CreateTodoUseCase } from "@server/src/usecase/interactor/create-todo.usecase";
import type { ICreateTodoUseCase } from "@server/src/usecase/interface/create-todo.usecase.interface";
import { GetTodoByIdUsecase } from "@server/src/usecase/interactor/get-todo-by-id.usecase";
import type { IGetTodoByIdUsecase } from "@server/src/usecase/interface/get-todo-by-id.usecase.interface";
import { EditTodoByIdUseCase } from "@server/src/usecase/interactor/edit-todo-by-id.usecase";
import type { IEditTodoByIdUsecase } from "@server/src/usecase/interface/edit-todo-by-id.usecase.interface";
import { DeleteTodoByIdUsecase } from "@server/src/usecase/interactor/delete-todo-by-id.usecase";
import type { IDeleteTodoByIdUsecase } from "@server/src/usecase/interface/delete-todo-by-id.usecase.interface";

/**
 * @class TodoController
 * @description /todos
 */
@injectable()
export class TodosController implements IBaseController {
  private serverApp = new OpenAPIHono();
  constructor(
    @inject(GetTodosByUserIdUsecase)
    private readonly getTodosByUserIdUsecase: IGetTodosByUserIdUsecase,
    @inject(GetUserIdUsecase)
    private readonly getUserIdUsecase: IGetUserIdUsecase,
    @inject(GetAllowedAllTodosUsecase)
    private readonly getAllowedAllTodosUsecase: IGetAllowedAllTodosUsecase,
    @inject(CreateTodoUseCase)
    private readonly createTodoUseCase: ICreateTodoUseCase,
    @inject(GetTodoByIdUsecase)
    private readonly getTodoByIdUsecase: IGetTodoByIdUsecase,
    @inject(EditTodoByIdUseCase)
    private readonly editTodoByIdUseCase: IEditTodoByIdUsecase,
    @inject(DeleteTodoByIdUsecase)
    private readonly deleteTodoByIdUsecase: IDeleteTodoByIdUsecase,
  ) {}
  public route(): OpenAPIHono {
    this.serverApp.post("/", async (c) => {
      const {
        title,
        creator,
        isPrivate,
      }: {
        title: string;
        creator: string;
        isPrivate?: boolean | undefined;
      } = await c.req.json();
      await this.createTodoUseCase.exec({
        title,
        creator,
        isPrivate,
        c,
      });
    });
    this.serverApp.get("/", async (c) => {
      const todos = await this.getAllowedAllTodosUsecase.exec(c);
      return c.json(todos);
    });
    this.serverApp.get("/my", async (c) => {
      const userId = await this.getUserIdUsecase.exec(c);
      const todos = await this.getTodosByUserIdUsecase.exec({ userId, c });
      return c.json(todos);
    });
    this.serverApp.get("/:id", async (c) => {
      const id = c.req.param("id");
      const todo = await this.getTodoByIdUsecase.exec({ id, c });
      return c.json(todo);
    });
    this.serverApp.put("/:id", async (c) => {
      const id = c.req.param("id");
      const {
        title,
        isPrivate,
      }: {
        title?: string | undefined;
        isPrivate?: boolean | undefined;
      } = await c.req.json();
      this.editTodoByIdUseCase.exec({
        id,
        title,
        isPrivate,
        c,
      });
    });
    this.serverApp.post("/:id/complete", async (c) => {
      const id = c.req.param("id");
      const todo = await this.editTodoByIdUseCase.exec({
        id,
        completed: true,
        c,
      });
      return c.json(todo);
    });
    this.serverApp.delete("/:id", async (c) => {
      const id = c.req.param("id");
      await this.deleteTodoByIdUsecase.exec({
        todoId: id,
        c,
      });
    });
    return this.serverApp;
  }
}
