import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { credentials } from "./credentials";
import { relations } from "drizzle-orm";

export const databaseCredentials = pgTable("database_credentials", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  credential_id: uuid("credential_id")
    .references(() => credentials.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  // TODO: encrypt
  connection_string: varchar("connection_string", { length: 500 }),
  databaseName: varchar("database_name", { length: 255 }),
  username: varchar("username", { length: 255 }),
  // TODO: encrypt
  password: varchar("password", { length: 255 }),
});

export const databaseCredentialRelations = relations(
  databaseCredentials,
  ({ one }) => ({
    credential: one(credentials, {
      fields: [databaseCredentials.credential_id],
      references: [credentials.id],
    }),
  }),
);
