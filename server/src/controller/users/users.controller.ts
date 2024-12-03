import { inject, injectable } from "tsyringe";
import { IBaseController } from "../base";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { IGetUserIdUsecase } from "@server/src/usecase/interface/get-user-id.usecase.interface";
import { GetUserIdUsecase } from "@server/src/usecase/interactor/get-user-id.usecase";
import { GetUserByIdUseCase } from "@server/src/usecase/interactor/get-user-by-id.usecase";
import type { IGetUserByIdUsecase } from "@server/src/usecase/interface/get-user-by-id.usecase.interface";
import { HTTPException } from "hono/http-exception";
import { EditUserByIdUseCase } from "@server/src/usecase/interactor/edit-user-by-id.usecase";
import type { IEditUserByIdUsecase } from "@server/src/usecase/interface/edit-user-by-id.usecase.interface";
import { GetUsersUsecase } from "@server/src/usecase/interactor/get-users.usecase";
import type { IGetUsersUsecase } from "@server/src/usecase/interface/get-users.usecase.interface";

/**
 * @class TodoController
 * @description /users
 */
@injectable()
export class UsersController implements IBaseController {
  constructor(
    @inject(GetUserIdUsecase)
    private readonly getUserIdUsecase: IGetUserIdUsecase,
    @inject(GetUserByIdUseCase)
    private readonly getUserByIdUseCase: IGetUserByIdUsecase,
    @inject(EditUserByIdUseCase)
    private readonly editUserByIdUseCase: IEditUserByIdUsecase,
    @inject(GetUsersUsecase)
    private readonly getUsersUsecase: IGetUsersUsecase,
  ) {}
  private serverApp = new OpenAPIHono();
  public route(): OpenAPIHono {
    this.serverApp.get("/", async (c) => {
      const users = await this.getUsersUsecase.exec(c);
      return c.json(users);
    });
    this.serverApp.get("/me", async (c) => {
      const userId = await this.getUserIdUsecase.exec(c);
      const user = await this.getUserByIdUseCase.exec({
        c,
        userId,
      });
      if (!user) {
        throw new HTTPException(403, {
          message: "Forbidden",
        });
      }
      return c.json(user);
    });
    this.serverApp.put("/me", async (c) => {
      const userId = await this.getUserIdUsecase.exec(c);
      const user = await this.editUserByIdUseCase.exec({
        userId,
        name: c.body.name,
        c,
      });
      return c.json(user);
    });
    this.serverApp.get("/:id", async (c) => {
      const userId = c.req.param("id");
      const user = await this.getUserByIdUseCase.exec({
        c,
        userId,
      });
      if (!user) {
        throw new HTTPException(404, {
          message: "Not Found",
        });
      }
      return c.json(user);
    });
    return this.serverApp;
  }
}
