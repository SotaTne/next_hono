import { D1Dialect } from "kysely-d1";
import { Database } from "../db.base";
import { Kysely } from "kysely";
import { D1Database } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
}

let db: Kysely<Database> | null = null;

/**
 * initializeD1 is substitute for the `db` instance in the `db.sqlite.ts` file.
 * in cloudflareD1, we need Env to initialize the `db` instance.
 */
export function initializeD1(env: Env): Kysely<Database> {
  if (db) {
    return db;
  }
  db = new Kysely<Database>({
    dialect: new D1Dialect({ database: env.DB }),
  });
  return db;
}
