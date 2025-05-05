import { credentials, credentialsRelations } from "./credentials";
import {
  databaseCredentialRelations,
  databaseCredentials,
} from "./databaseCredentials";
import { envCredentialRelations, envCredentials } from "./envCredentials";
import { groups, groupsRelations } from "./groups";
import { teamGroups } from "./teamGroups";
import { teamMembers } from "./teamMembers";
import { teams, teamRelations } from "./teams";
import {
  serverCredentialRelations,
  serverCredentials,
} from "./serverCredentials";
import {
  serviceCredentialRelations,
  serviceCredentials,
} from "./serviceCredentials";
import {
  accounts,
  authenticators,
  sessions,
  users,
  usersRelations,
} from "./users";

export * from "./users";
export * from "./teams";
export * from "./groups";
export * from "./enums";
export * from "./credentials";
export * from "./teamGroups";
export * from "./teamMembers";

export const schemaRelations = {
  usersRelations,
  teamRelations,
  groupsRelations,
  credentialsRelations,
  databaseCredentialRelations,
  envCredentialRelations,
  serverCredentialRelations,
  serviceCredentialRelations,
};

export const schema = {
  accounts,
  authenticators,
  sessions,
  users,
  teams,
  groups,
  credentials,
  teamGroups,
  teamMembers,
  databaseCredentials,
  envCredentials,
  serverCredentials,
  serviceCredentials,
};
