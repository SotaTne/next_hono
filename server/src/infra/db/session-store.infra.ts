import { PrismaClient } from "@prisma/client";
import { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import { maxAge } from "@server/src/public/session";
import { injectable } from "tsyringe";
import { HTTPException } from "hono/http-exception";
import { DBAbstract } from "./db.abstract";

@injectable()
export class SessionStoreInfra
  extends DBAbstract
  implements ISessionStoreInfra
{
  prisma: PrismaClient | null = null;

  async isExistSession(sessionId: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      const session = await this.prisma.session.findFirst({
        where: {
          sessionId,
        },
      });
      if (!session || session.expires < new Date()) {
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }
  async setSession({
    sessionId,
    userId,
  }: {
    sessionId: string;
    userId: string;
  }): Promise<void> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      await this.prisma.session.create({
        data: {
          sessionId,
          expires: new Date(Date.now() + 1000 * maxAge),
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
  async updateSessionExpires(sessionId: string): Promise<void> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      await this.prisma.session.update({
        where: {
          sessionId,
        },
        data: {
          expires: new Date(Date.now() + 1000 * maxAge),
        },
      });
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }
  async deleteSession(sessionId: string): Promise<void> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      await this.prisma.session.delete({
        where: {
          sessionId,
        },
      });
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }
  async cleanUpSessions(): Promise<void> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      await this.prisma.session.deleteMany({
        where: {
          expires: {
            lt: new Date(),
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
  async getUserIdBySession(sessionId: string): Promise<string | null> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error ",
        });
      }
      const session = await this.prisma.session.findFirst({
        where: {
          sessionId,
        },
      });
      if (!session || session.expires < new Date()) {
        this.deleteSession(sessionId);
        return null;
      }
      return session.userId;
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error ",
      });
    }
  }
}
