import { Context } from "hono";
import { UserSessionEntity } from "../entity/user-session.entity";

export interface ILogin {
  setCookie(props: UserSessionEntity, c: Context): Promise<URL | null>;
}
