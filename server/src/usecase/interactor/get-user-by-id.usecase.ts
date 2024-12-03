import { UserEntity } from "@server/src/domain/entity/user.entity";
import type { IUserInfra } from "@server/src/domain/interface/db/user.infra.interface";
import { UserInfra } from "@server/src/infra/db/user.infra";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { inject, injectable } from "tsyringe";
import { IGetUserByIdUsecase } from "../interface/get-user-by-id.usecase.interface";

@injectable()
export class GetUserByIdUseCase implements IGetUserByIdUsecase {
  constructor(
    @inject(UserInfra)
    private readonly userInfra: IUserInfra,
  ) {}

  async exec({
    c,
    userId,
  }: {
    c: Context;
    userId: string;
  }): Promise<UserEntity> {
    await this.userInfra.initPrisma(c);
    const user = await this.userInfra.getUser(userId);
    if (!user) {
      throw new HTTPException(404, {
        message: "Not Found",
      });
    }
    return user;
  }
}
