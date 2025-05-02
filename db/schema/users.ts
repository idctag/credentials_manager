import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projectMembers } from "./projectMembers";
import { groups } from "./groups";
import { projects } from "./projects";
import { credentials } from "./credentials";

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projectMembers),
  groups: many(groups),
  ownedProjects: many(projects),
  credentials: many(credentials),
}));
