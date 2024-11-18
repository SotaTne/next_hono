import { sql, Kysely } from "kysely";

export function up<T>(db: Kysely<T>) {
  db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("name", "text", (col) => col.notNull());
  db.schema
    .createTable("oauth_account")
    .addColumn("provider_id", "text", (col) => col.notNull())
    .addColumn("provider_user_id", "text", (col) => col.primaryKey())
    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull(),
    );
  db.schema
    .createTable("sessions")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull(),
    );
  db.schema
    .createTable("todos")
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("title", "text")
    .addColumn("completed", "boolean")
    .addColumn("public", "boolean")
    .addColumn("user_id", "uuid", (col) =>
      col.references("users.id").onDelete("set null"),
    );
}

export function down<T>(db: Kysely<T>) {
  db.schema.dropTable("todos");
  db.schema.dropTable("sessions");
  db.schema.dropTable("oauth_account");
  db.schema.dropTable("users");
}
