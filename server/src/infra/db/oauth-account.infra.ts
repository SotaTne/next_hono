import { OAuthAccount, PrismaClient } from "@prisma/client";
import { IOAuthAccountInfra } from "@server/src/domain/interface/db/oauth-account.infra.interface";
import { HTTPException } from "hono/http-exception";
import { injectable } from "tsyringe";
import { DBAbstract } from "./db.abstract";

@injectable()
export class OAuthAccountInfra
  extends DBAbstract
  implements IOAuthAccountInfra
{
  prisma: PrismaClient | null = null;
  async createOAuthAccount({
    providerId,
    providerAccountId,
    userId,
  }: {
    providerId: string;
    providerAccountId: string;
    userId: string;
  }): Promise<OAuthAccount> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      return await this.prisma.oAuthAccount.create({
        data: {
          providerId,
          providerAccountId,
          userId,
        },
      });
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }

  async getOAuthAccount({
    providerId,
    providerAccountId,
  }: {
    providerId: string;
    providerAccountId: string;
  }): Promise<OAuthAccount | null> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      return await this.prisma.oAuthAccount.findUnique({
        where: {
          providerId_providerAccountId: {
            providerId,
            providerAccountId,
          },
        },
      });
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }
}
