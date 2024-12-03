import type { IUserInfra } from "@server/src/domain/interface/db/user.infra.interface";
import { IEditUserByIdUsecase } from "../interface/edit-user-by-id.usecase.interface";
import { inject, injectable } from "tsyringe";
import { UserInfra } from "@server/src/infra/db/user.infra";
import { Context } from "hono";
import { UserEntity } from "@server/src/domain/entity/user.entity";

@injectable()
export class EditUserByIdUseCase implements IEditUserByIdUsecase {
  constructor(
    @inject(UserInfra)
    private readonly userInfra: IUserInfra,
  ) {}
  async exec({
    userId,
    name,
    c,
  }: {
    userId: string;
    name: string;
    c: Context;
  }): Promise<UserEntity> {
    await this.userInfra.initPrisma(c);
    return await this.userInfra.updateUser(userId, name);
  }
}
