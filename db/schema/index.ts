import { credentialsTable, credentialsRelations } from "./credentials";
import {
  databaseCredentialRelations,
  databaseCredentialTable,
} from "./database_credentials";
import { groupsTable, groupsRelations } from "./groups";
import {
  serverCredentialRelations,
  serverCredentialTable,
} from "./server_credentials";
import { teamsTable, teamRelations } from "./teams";
import { usersTable, usersRelations } from "./users";

export * from "./users";
export * from "./teams";
export * from "./groups";
export * from "./enums";
export * from "./credentials";

export const schemaRelations = {
  usersRelations,
  teamRelations,
  groupsRelations,
  credentialsRelations,
  databaseCredentialRelations,
  serverCredentialRelations,
};

export const schema = {
  users: usersTable,
  teams: teamsTable,
  groups: groupsTable,
  credentials: credentialsTable,
  database_credentials: databaseCredentialTable,
  server_credentials: serverCredentialTable,
};
