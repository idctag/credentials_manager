import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { groups } from "./groups";
import { relations } from "drizzle-orm";

export const projectGroups = pgTable(
  "project_groups",
  {
    project_id: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    group_id: uuid("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.project_id, t.group_id] })],
);

export const projectGroupsRelations = relations(projectGroups, ({ one }) => ({
  project: one(projects, {
    fields: [projectGroups.project_id],
    references: [projects.id],
  }),
  group: one(groups, {
    fields: [projectGroups.group_id],
    references: [groups.id],
  }),
}));
