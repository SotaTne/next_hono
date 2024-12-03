import { UserEntity } from "@server/src/domain/entity/user.entity";
import type { IUserInfra } from "@server/src/domain/interface/db/user.infra.interface";
import { UserInfra } from "@server/src/infra/db/user.infra";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";
import { IGetUsersUsecase } from "../interface/get-users.usecase.interface";

@injectable()
export class GetUsersUsecase implements IGetUsersUsecase {
  constructor(
    @inject(UserInfra)
    private readonly userRepository: IUserInfra,
  ) {}

  async exec(c: Context): Promise<UserEntity[]> {
    await this.userRepository.initPrisma(c);
    return await this.userRepository.getUsers();
  }
}
