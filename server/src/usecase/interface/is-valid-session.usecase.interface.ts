import { Context } from "hono";

export interface IIsValidSessionUseCase {
  exec(c: Context): Promise<boolean>;
}
