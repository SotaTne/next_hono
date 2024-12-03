import { PrismaClient } from "@prisma/client";
import { getNewPrismaClient } from "@server/src/public/prismaClient";
import { Context } from "hono";

export abstract class DBAbstract {
  abstract prisma: PrismaClient | null;
  async initPrisma(c: Context): Promise<void> {
    if (!this.prisma) {
      this.prisma = await getNewPrismaClient(c);
    }
  }
}
