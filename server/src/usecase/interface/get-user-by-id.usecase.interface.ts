import { UserEntity } from "@server/src/domain/entity/user.entity";
import { Context } from "hono";

export interface IGetUserByIdUsecase {
  exec({
    c,
    userId,
  }: {
    c: Context;
    userId: string;
  }): Promise<UserEntity | null>;
}
