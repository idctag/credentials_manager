import { credentials } from "./credentials";
import { groups } from "./groups";
import { projectGroups } from "./projectGroups";
import { projectMembers } from "./projectMembers";
import { projects } from "./projects";
import { users } from "./users";

export * from "./users";
export * from "./projects";
export * from "./groups";
export * from "./enums";
export * from "./credentials";
export * from "./projectGroups";
export * from "./projectMembers";

export const schema = {
  users,
  projects,
  groups,
  credentials,
  projectGroups,
  projectMembers,
};
