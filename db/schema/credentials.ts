import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { groups } from "./groups";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { credentialTypeEnum } from "./enums";

export const credentials = pgTable("credentials", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  type: credentialTypeEnum("type").notNull().default("service"),
  details: jsonb("details"),
  project_id: uuid("project_id").references(() => projects.id),
  owner_id: uuid("owner_id").references(() => users.id),
  group_id: uuid("group_id").references(() => groups.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const credentialsRelations = relations(credentials, ({ one }) => ({
  project: one(projects, {
    fields: [credentials.project_id],
    references: [projects.id],
  }),
  group: one(groups, {
    fields: [credentials.group_id],
    references: [groups.id],
  }),
}));
