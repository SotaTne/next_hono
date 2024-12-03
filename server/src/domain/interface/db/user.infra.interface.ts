import { IDbAbstract } from "./db.abstract.interface";
import { UserEntity } from "../../entity/user.entity";

export interface IUserInfra extends IDbAbstract {
  getUser(userId: string): Promise<UserEntity | null>;
  getUsers(): Promise<UserEntity[]>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  createUser(email: string, name: string): Promise<UserEntity>;
  updateUser(userId: string, name: string): Promise<UserEntity>;
}
