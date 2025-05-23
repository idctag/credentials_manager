import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { credentialsTable } from "./credentials";
import { credentialTypeEnum } from "./enums";

export const databaseCredentialTable = pgTable("database_credentials", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  type: credentialTypeEnum("type").notNull().default("db_connection"),
  username: varchar("username", { length: 255 }),
  password: varchar("password", { length: 255 }),
  connection_string: varchar("connection_string", { length: 500 }),
  description: text("description"),
  credential_id: uuid("credential_id")
    .references(() => credentialsTable.id)
    .notNull(),
}).enableRLS();

export const databaseCredentialRelations = relations(
  databaseCredentialTable,
  ({ one }) => ({
    credential: one(credentialsTable, {
      fields: [databaseCredentialTable.credential_id],
      references: [credentialsTable.id],
    }),
  }),
);
