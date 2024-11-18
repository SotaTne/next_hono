import { injectable } from "tsyringe";
import { IBaseController } from "../base";
import { OpenAPIHono } from "@hono/zod-openapi";

/**
 * @class TodoController
 * @description /todos
 */
@injectable()
export class TodosController implements IBaseController {
  private serverApp = new OpenAPIHono();
  public route(): OpenAPIHono {
    this.serverApp.post("/", (c) => {
      console.log("todos post");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.get("/", (c) => {
      console.log("todos get");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.get("/:id", (c) => {
      console.log("todos get id");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.put("/:id", (c) => {
      console.log("todos put");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.delete("/:id", (c) => {
      console.log("todos delete");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    return this.serverApp;
  }
}
