import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { credentials } from "./credentials";
import { relations } from "drizzle-orm";

export const serverCredentials = pgTable("server_credentials", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  credential_id: uuid("credential_id").references(() => credentials.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  server_address: varchar("server_address", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }),
  // TODO: encrypt
  password: varchar("password", { length: 255 }),
});

export const serverCredentialRelations = relations(
  serverCredentials,
  ({ one }) => ({
    credential: one(credentials, {
      fields: [serverCredentials.credential_id],
      references: [credentials.id],
    }),
  }),
);
