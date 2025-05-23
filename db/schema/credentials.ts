import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { teamsTable } from "./teams";
import { groupsTable } from "./groups";
import { relations } from "drizzle-orm";
import { usersTable } from "./users";
import { databaseCredentialTable } from "./database_credentials";
import { serverCredentialTable } from "./server_credentials";

export const credentialsTable = pgTable("credentials", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  team_id: uuid("team_id").references(() => teamsTable.id, {
    onDelete: "cascade",
  }),
  owner_id: uuid("owner_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  group_id: uuid("group_id").references(() => groupsTable.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS();

export const credentialsRelations = relations(
  credentialsTable,
  ({ one, many }) => ({
    team: one(teamsTable, {
      fields: [credentialsTable.team_id],
      references: [teamsTable.id],
    }),
    group: one(groupsTable, {
      fields: [credentialsTable.group_id],
      references: [groupsTable.id],
    }),
    owner: one(usersTable, {
      fields: [credentialsTable.owner_id],
      references: [usersTable.id],
    }),
    databases: many(databaseCredentialTable),
    servers: many(serverCredentialTable),
  }),
);
