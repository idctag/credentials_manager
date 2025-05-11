import { pgEnum } from "drizzle-orm/pg-core";

export const teamRoleEnum = pgEnum("team_role", ["admin", "member"]);
export const credentialTypeEnum = pgEnum("credential_type", [
  "db_connection",
  "server",
]);

export type TeamRole = (typeof teamRoleEnum.enumValues)[number];
export type CredentialType = (typeof credentialTypeEnum.enumValues)[number];
