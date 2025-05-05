import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { credentials } from "./credentials";
import { relations } from "drizzle-orm";

export const envCredentials = pgTable("env_credentials", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  credential_id: uuid("credential_id")
    .references(() => credentials.id, { onDelete: "cascade" })
    .notNull(),
  // TODO: encrypt
  text: text("text"),
});

export const envCredentialRelations = relations(envCredentials, ({ one }) => ({
  credential: one(credentials, {
    fields: [envCredentials.credential_id],
    references: [credentials.id],
  }),
}));
