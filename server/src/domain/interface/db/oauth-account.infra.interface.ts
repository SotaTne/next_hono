import { OAuthAccount } from "@prisma/client";
import { IDbAbstract } from "./db.abstract.interface";

export interface IOAuthAccountInfra extends IDbAbstract {
  createOAuthAccount({
    providerId,
    providerAccountId,
    userId,
  }: {
    providerId: string;
    providerAccountId: string;
    userId: string;
  }): Promise<OAuthAccount>;

  getOAuthAccount({
    providerId,
    providerAccountId,
  }: {
    providerId: string;
    providerAccountId: string;
  }): Promise<OAuthAccount | null>;
}
