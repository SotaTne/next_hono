import { UserEntity } from "@server/src/domain/entity/user.entity";
import { Context } from "hono";

export interface IGetUsersUsecase {
  exec(c: Context): Promise<UserEntity[]>;
}
