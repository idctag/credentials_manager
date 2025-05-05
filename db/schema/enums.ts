import { pgEnum } from "drizzle-orm/pg-core";

export const teamRoleEnum = pgEnum("team_role", ["admin", "member"]);
export const credentialTypeEnum = pgEnum("credential_type", [
  "database",
  "service",
  "server",
  "env",
]);
