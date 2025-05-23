import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { relations } from "drizzle-orm";
import { credentialsTable } from "./credentials";
import { groupsTable } from "./groups";
import { teamRoleEnum } from "./enums";

export const teamsTable = pgTable("teams", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  owner_id: uuid("owner_id").references(() => usersTable.id),
}).enableRLS();

export const teamRelations = relations(teamsTable, ({ many, one }) => ({
  owner: one(usersTable, {
    fields: [teamsTable.owner_id],
    references: [usersTable.id],
  }),
  groups: many(groupsTable),
  credentials: many(credentialsTable),
}));

export const userTeamsTable = pgTable(
  "user_teams",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teamsTable.id),
    role: teamRoleEnum("role").notNull().default("member"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.teamId] })],
).enableRLS();
