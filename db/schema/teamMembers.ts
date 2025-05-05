import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { teams } from "./teams";
import { users } from "./users";
import { teamRoleEnum } from "./enums";
import { relations } from "drizzle-orm";

export const teamMembers = pgTable(
  "team_members",
  {
    team_id: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: teamRoleEnum("role").notNull().default("member"),
  },
  (t) => [primaryKey({ columns: [t.team_id, t.user_id] })],
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.team_id],
    references: [teams.id],
  }),
  member: one(users, {
    fields: [teamMembers.user_id],
    references: [users.id],
  }),
}));
