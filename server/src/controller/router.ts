import "reflect-metadata";

import { injectWithTransform, singleton } from "tsyringe";
import { UsersController } from "./users/users.controller";
import { AuthController } from "./auth/auth.controller";
import { OpenAPIHono } from "@hono/zod-openapi";
import { TodosController } from "./todos/todos.controller";
import { HonoControllerTransformer } from "./base";

@singleton()
export class Router {
  private serverApp: OpenAPIHono;
  constructor(
    @injectWithTransform(TodosController, HonoControllerTransformer)
    private todosRouter: OpenAPIHono,
    @injectWithTransform(UsersController, HonoControllerTransformer)
    private usersRouter: OpenAPIHono,
    @injectWithTransform(AuthController, HonoControllerTransformer)
    private authRouter: OpenAPIHono,
  ) {
    this.serverApp = new OpenAPIHono();
    this.serverApp.route("/todos", this.todosRouter);
    this.serverApp.route("/users", this.usersRouter);
    this.serverApp.route("/auth", this.authRouter);
  }
  public route() {
    return this.serverApp;
  }
}
