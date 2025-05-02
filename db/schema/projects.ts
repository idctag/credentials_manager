import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { projectMembers } from "./projectMembers";
import { projectGroups } from "./projectGroups";
import { credentials } from "./credentials";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  owner_id: uuid("owner_id").references(() => users.id),
});

export const projectsRelations = relations(projects, ({ many, one }) => ({
  owner: one(users, {
    fields: [projects.owner_id],
    references: [users.id],
  }),
  members: many(projectMembers),
  groups: many(projectGroups),
  credentials: many(credentials),
}));
