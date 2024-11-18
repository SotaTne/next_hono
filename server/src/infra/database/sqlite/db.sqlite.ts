import sqlite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { Database } from "../db.base";

export const sqliteDatabase = sqlite();

export const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: sqliteDatabase,
  }),
});
