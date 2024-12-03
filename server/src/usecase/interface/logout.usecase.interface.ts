import { Context } from "hono";

export interface ILogoutUseCase {
  exec(c: Context): Promise<void>;
}
