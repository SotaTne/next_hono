import { Context } from "hono";

export interface IGetUserIdUsecase {
  exec(c: Context): Promise<string>;
}
