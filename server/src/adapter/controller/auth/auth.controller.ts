import { injectable } from "tsyringe";
import { IBaseController } from "../base";
import { route } from "./openapi/auth.openapi";
import { OpenAPIHono } from "@hono/zod-openapi";

/**
 * @class TodoController
 * @description /auth
 */
@injectable()
export class AuthController implements IBaseController {
  private serverApp = new OpenAPIHono();
  public route(): OpenAPIHono {
    this.serverApp.openapi(route, (c) => {
      console.log("login");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.post("/signin", (c) => {
      console.log("register");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.post("/logout", (c) => {
      console.log("logout");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    this.serverApp.get("/check", (c) => {
      console.log("check");
      return c.json({
        message: "Hello from Hono Clean Architecture!",
      });
    });
    return this.serverApp;
  }
}
