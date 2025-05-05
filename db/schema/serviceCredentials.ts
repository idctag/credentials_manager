import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { credentials } from "./credentials";
import { relations } from "drizzle-orm";

export const serviceCredentials = pgTable("service_credentials", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  credential_id: uuid("credential_id").references(() => credentials.id, {
    onDelete: "cascade",
  }),
  url: varchar("url", { length: 500 }),
  username: varchar("username", { length: 255 }),
  // TODO: encrypt
  password: varchar("password", { length: 255 }),
});

export const serviceCredentialRelations = relations(
  serviceCredentials,
  ({ one }) => ({
    credential: one(credentials, {
      fields: [serviceCredentials.credential_id],
      references: [credentials.id],
    }),
  }),
);
