import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";
import { projectRoleEnum } from "./enums";
import { relations } from "drizzle-orm";

export const projectMembers = pgTable(
  "project_members",
  {
    project_id: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: projectRoleEnum("role").notNull().default("member"),
  },
  (t) => [primaryKey({ columns: [t.project_id, t.user_id] })],
);

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.project_id],
    references: [projects.id],
  }),
  member: one(users, {
    fields: [projectMembers.user_id],
    references: [users.id],
  }),
}));
