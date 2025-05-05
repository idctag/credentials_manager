import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { teams } from "./teams";
import { groups } from "./groups";
import { relations } from "drizzle-orm";

export const teamGroups = pgTable(
  "team_groups",
  {
    team_id: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    group_id: uuid("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.team_id, t.group_id] })],
);

export const teamGroupsRelations = relations(teamGroups, ({ one }) => ({
  team: one(teams, {
    fields: [teamGroups.team_id],
    references: [teams.id],
  }),
  group: one(groups, {
    fields: [teamGroups.group_id],
    references: [groups.id],
  }),
}));
