import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { groupsTable } from "./groups";
import { teamsTable } from "./teams";
import { credentialsTable } from "./credentials";

export const usersTable = pgTable("users", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  teams: many(teamsTable),
  ownedGroups: many(groupsTable),
  ownedTeams: many(teamsTable),
  credentials: many(credentialsTable),
}));
