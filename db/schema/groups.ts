import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";
import { credentialsTable } from "./credentials";
import { teamsTable } from "./teams";

export const groupsTable = pgTable("groups", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  owner_id: uuid("owner_id")
    .references(() => usersTable.id)
    .notNull(),
  team_id: uuid("team_id")
    .references(() => teamsTable.id)
    .notNull(),
}).enableRLS();

export const groupsRelations = relations(groupsTable, ({ many, one }) => ({
  owner: one(usersTable, {
    fields: [groupsTable.owner_id],
    references: [usersTable.id],
  }),
  teams: one(teamsTable, {
    fields: [groupsTable.team_id],
    references: [teamsTable.id],
  }),
  credentials: many(credentialsTable),
}));
