import { injectable } from "tsyringe";
import { IBaseController } from "../base";
import { OpenAPIHono } from "@hono/zod-openapi";

/**
 * @class TodoController
 * @description /users
 */
@injectable()
export class UsersController implements IBaseController {
  private serverApp = new OpenAPIHono();
  public route(): OpenAPIHono {
    this.serverApp.get("/me", (c) => {
      console.log("me");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.put("/me", (c) => {
      console.log("me put");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.get("/:id", (c) => {
      console.log("user id");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    return this.serverApp;
  }
}
