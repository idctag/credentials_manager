import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { teamMembers } from "./teamMembers";
import { teamGroups } from "./teamGroups";
import { credentials } from "./credentials";

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  owner_id: uuid("owner_id").references(() => users.id),
});

export const teamRelations = relations(teams, ({ many, one }) => ({
  owner: one(users, {
    fields: [teams.owner_id],
    references: [users.id],
  }),
  members: many(teamMembers),
  groups: many(teamGroups),
  credentials: many(credentials),
}));
