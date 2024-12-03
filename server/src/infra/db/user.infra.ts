import { PrismaClient, User } from "@prisma/client";
import { IUserInfra } from "@server/src/domain/interface/db/user.infra.interface";
import { HTTPException } from "hono/http-exception";
import { injectable } from "tsyringe";
import { DBAbstract } from "./db.abstract";
import { UserEntity } from "@server/src/domain/entity/user.entity";

@injectable()
export class UserInfra extends DBAbstract implements IUserInfra {
  prisma: PrismaClient | null = null;

  async createUser(email: string, name: string): Promise<UserEntity> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      return this.toEntity(
        await this.prisma.user.create({
          data: {
            email,
            name,
          },
        }),
      );
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }

  async getUsers(): Promise<UserEntity[]> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      return (await this.prisma.user.findMany()).map((user) =>
        this.toEntity(user),
      );
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }

  async getUser(userId: string): Promise<UserEntity | null> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return null;
      }
      return this.toEntity(user);
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }
  async getUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return null;
      }
      return this.toEntity(user);
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }

  async updateUser(userId: string, name: string): Promise<UserEntity> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      return this.toEntity(
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            name,
          },
        }),
      );
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }

  private toEntity(user: User): UserEntity {
    return new UserEntity({
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      id: user.id,
      email: user.email,
    });
  }
}
