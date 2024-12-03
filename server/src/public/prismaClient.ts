import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

let prisma: PrismaClient | null = null;

export async function getNewPrismaClient(c?: Context): Promise<PrismaClient> {
  if (!prisma) {
    if (!c) {
      console.error("Context is null and Prisma is not initialized");
      throw new HTTPException(500, {
        message:
          "Internal Server Error: Context is required to initialize Prisma",
      });
    }
    try {
      if (c.env && c.env.DB) {
        // Cloudflare 環境 (c.env.DB が存在)
        console.log(
          "Initializing Prisma with PrismaD1 adapter (Cloudflare environment)",
        );
        const adapter = new PrismaD1(c.env.DB);
        prisma = new PrismaClient({ adapter });
      } else {
        // その他の環境 (c.env.DB が存在しない)
        console.log(
          "Initializing Prisma for local development (non-Cloudflare environment)",
        );
        prisma = new PrismaClient();
      }
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error",
      });
    }
  }

  return prisma;
}
