import "reflect-metadata";

import { TodosController } from "@server/src/adapter/controller/todos/todos.controller";
import { injectWithTransform, singleton } from "tsyringe";
import { HonoControllerTransformer } from "@server/src/adapter/controller/base";
import { UsersController } from "./users/users.controller";
import { AuthController } from "./auth/auth.controller";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

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
    this.serverApp.get(
      "/ui",
      swaggerUI({
        url: "/doc",
      }),
    );
  }
  public route() {
    return this.serverApp;
  }
}
