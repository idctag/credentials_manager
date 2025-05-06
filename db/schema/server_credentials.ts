import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { credentialsTable } from "./credentials";

export const serverCredentialTable = pgTable("server_credentials", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  username: varchar("username", { length: 255 }),
  password: varchar("password", { length: 255 }),
  url: varchar("server_address", { length: 500 }),
  description: text("description"),
  credential_id: uuid("credential_id").references(() => credentialsTable.id),
});

export const serverCredentialRelations = relations(
  serverCredentialTable,
  ({ one }) => ({
    credential: one(credentialsTable, {
      fields: [serverCredentialTable.credential_id],
      references: [credentialsTable.id],
    }),
  }),
);
