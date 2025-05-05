import { credentials, credentialsRelations } from "./credentials";
import {
  databaseCredentialRelations,
  databaseCredentials,
} from "./databaseCredentials";
import { envCredentialRelations, envCredentials } from "./envCredentials";
import { groups, groupsRelations } from "./groups";
import { projectGroups } from "./projectGroups";
import { projectMembers } from "./projectMembers";
import { projects, projectsRelations } from "./projects";
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
  verificationTokens,
} from "./users";

export * from "./users";
export * from "./projects";
export * from "./groups";
export * from "./enums";
export * from "./credentials";
export * from "./projectGroups";
export * from "./projectMembers";

export const schemaRelations = {
  usersRelations,
  projectsRelations,
  groupsRelations,
  credentialsRelations,
  databaseCredentialRelations,
  envCredentialRelations,
  serverCredentialRelations,
  serviceCredentialRelations,
};

export const schema = {
  accounts,
  verificationTokens,
  authenticators,
  sessions,
  users,
  projects,
  groups,
  credentials,
  projectGroups,
  projectMembers,
  databaseCredentials,
  envCredentials,
  serverCredentials,
  serviceCredentials,
};
