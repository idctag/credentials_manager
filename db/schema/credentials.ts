import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { teams } from "./teams";
import { groups } from "./groups";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { credentialTypeEnum } from "./enums";
import { databaseCredentials } from "./databaseCredentials";
import { serviceCredentials } from "./serviceCredentials";
import { serverCredentials } from "./serverCredentials";
import { envCredentials } from "./envCredentials";

export const credentials = pgTable("credentials", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  type: credentialTypeEnum("type").notNull().default("service"),
  team_id: uuid("team_id").references(() => teams.id, {
    onDelete: "cascade",
  }),
  owner_id: uuid("owner_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  group_id: uuid("group_id").references(() => groups.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const credentialsRelations = relations(credentials, ({ one }) => ({
  team: one(teams, {
    fields: [credentials.team_id],
    references: [teams.id],
  }),
  group: one(groups, {
    fields: [credentials.group_id],
    references: [groups.id],
  }),
  databaseCredential: one(databaseCredentials, {
    fields: [credentials.id],
    references: [databaseCredentials.credential_id],
  }),
  serviceCredential: one(serviceCredentials, {
    fields: [credentials.id],
    references: [serviceCredentials.credential_id],
  }),
  serverCredential: one(serverCredentials, {
    fields: [credentials.id],
    references: [serverCredentials.credential_id],
  }),
  envCredential: one(envCredentials, {
    fields: [credentials.id],
    references: [envCredentials.credential_id],
  }),
}));
