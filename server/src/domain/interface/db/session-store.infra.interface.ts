import { IDbAbstract } from "./db.abstract.interface";

export interface ISessionStoreInfra extends IDbAbstract {
  isExistSession(sessionId: string): Promise<boolean>;
  setSession({
    sessionId,
    userId,
  }: {
    sessionId: string;
    userId: string;
  }): Promise<void>;
  updateSessionExpires(sessionId: string): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  cleanUpSessions(): Promise<void>;
  getUserIdBySession(sessionId: string): Promise<string | null>;
}
