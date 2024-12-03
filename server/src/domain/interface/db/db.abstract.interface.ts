import { Context } from "hono";

export interface IDbAbstract {
  initPrisma(c: Context): Promise<void>;
}
