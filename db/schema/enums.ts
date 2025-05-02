import { pgEnum } from "drizzle-orm/pg-core";

export const projectRoleEnum = pgEnum("project_role", ["admin", "member"]);
export const credentialTypeEnum = pgEnum("credential_type", [
  "database",
  "service",
  "server",
]);
