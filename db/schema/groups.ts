import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { projectGroups } from "./projectGroups";
import { credentials } from "./credentials";

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  desription: text("description"),
  owner_id: uuid("owner_id").references(() => users.id),
});

export const groupsRelations = relations(groups, ({ many, one }) => ({
  owner: one(users, {
    fields: [groups.owner_id],
    references: [users.id],
  }),
  projects: many(projectGroups),
  credentials: many(credentials),
}));
