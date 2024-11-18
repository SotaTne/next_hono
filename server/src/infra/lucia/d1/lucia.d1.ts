import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Env } from "@server/src/infra/database/d1/db.d1";
import { UserTable } from "../../database/db.base";

let lucia: Lucia | null = null;

/**
 * initializeLucia is substitute for the `lucia` instance in the `lucia.sqlite.ts` file.
 * in cloudflareD1, we need Env to initialize the `lucia` instance.
 */
export function initializeLucia(env: Env): Lucia {
  const adapter = new D1Adapter(env.DB, {
    user: "user",
    session: "session",
  });
  if (lucia) {
    return lucia;
  }
  lucia = new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    getUserAttributes: (attributes) => {
      return {
        username: attributes.name,
      };
    },
  });
  return lucia;
}

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DabaBaseUserAttributes: Omit<UserTable, "id">;
  }
}
