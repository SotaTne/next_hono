import type { ISessionCookieInfra } from "@server/src/domain/interface/session/session-cookie.infra.interface";
import type { ISessionStoreInfra } from "@server/src/domain/interface/db/session-store.infra.interface";
import { SessionStoreInfra } from "@server/src/infra/db/session-store.infra";
import { SessionCookieInfra } from "@server/src/infra/session/session-cookie.infra";
import { Context } from "hono";
import { inject, injectable } from "tsyringe";
import { ILoginWithProviderUseCase } from "../interface/login-with-provider.usecase.interface";
import { UserInfra } from "@server/src/infra/db/user.infra";
import type { IUserInfra } from "@server/src/domain/interface/db/user.infra.interface";
import type { IOAuthAccountInfra } from "@server/src/domain/interface/db/oauth-account.infra.interface";
import { OAuthAccountInfra } from "@server/src/infra/db/oauth-account.infra";

@injectable()
export class LoginWithProviderUseCase implements ILoginWithProviderUseCase {
  constructor(
    @inject(SessionCookieInfra)
    private sessionCookieInfra: ISessionCookieInfra,
    @inject(SessionStoreInfra)
    private sessionStoreInfra: ISessionStoreInfra,
    @inject(UserInfra)
    private userInfra: IUserInfra,
    @inject(OAuthAccountInfra)
    private oauthAccountInfra: IOAuthAccountInfra,
  ) {}

  async exec({
    email,
    providerUserId,
    name,
    providerId,
    c,
  }: {
    email: string;
    providerUserId: string;
    name: string;
    providerId: string;
    c: Context;
  }): Promise<void> {
    await this.sessionStoreInfra.initPrisma(c);
    await this.userInfra.initPrisma(c);
    await this.oauthAccountInfra.initPrisma(c);
    // 必須パラメータのバリデーション
    if (!providerUserId || !email || !name) {
      throw new Error("Invalid parameter");
    }

    const sessionId = this.sessionCookieInfra.getSessionCookie(c);
    let userId = email
      ? (await this.userInfra.getUserByEmail(email))?.id
      : null;

    // OAuthアカウントの検索または作成
    let oauthAccount = await this.oauthAccountInfra.getOAuthAccount({
      providerId,
      providerAccountId: providerUserId,
    });

    // ユーザーが存在しない場合は作成
    if (!userId) {
      const user = await this.userInfra.createUser(email, name);
      userId = user.id;
    }

    // OAuthアカウントが存在しない場合は作成
    if (!oauthAccount) {
      oauthAccount = await this.oauthAccountInfra.createOAuthAccount({
        providerId,
        providerAccountId: providerUserId,
        userId,
      });
    }

    // セッション管理
    if (!sessionId) {
      // 既存のセッションがない場合は新規作成
      const newSessionId = crypto.randomUUID();
      this.sessionCookieInfra.setSessionCookie({
        c,
        sessionId: newSessionId,
      });
      await this.sessionStoreInfra.setSession({
        sessionId: newSessionId,
        userId,
      });
    } else {
      // 既存セッションの有効期限を更新
      await this.sessionStoreInfra.updateSessionExpires(sessionId);
      this.sessionCookieInfra.updateSessionExpires({ sessionId, c });
    }
  }
}
