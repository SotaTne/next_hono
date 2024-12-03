import { Context } from "hono";

export interface ILoginWithProviderUseCase {
  exec({
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
  }): Promise<void>;
}
