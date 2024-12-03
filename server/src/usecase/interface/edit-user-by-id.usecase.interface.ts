import { UserEntity } from "@server/src/domain/entity/user.entity";
import { Context } from "hono";

export interface IEditUserByIdUsecase {
  exec({
    userId,
    name,
    c,
  }: {
    userId: string;
    name: string;
    c: Context;
  }): Promise<UserEntity>;
}
