"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { credentialsTable, groupsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SelectTeamCredential } from "./credentials";

export type SelectTeamGroups = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string | null;
};

export type SelectTeamGroupsWithCredentials = {
  group: {
    id: string;
    name: string;
    description: string | null;
    owner_id: string | null;
  };
  credentials: SelectTeamCredential | null;
};

export async function getTeamGroups(
  teamId: string,
): Promise<SelectTeamGroups[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const teamGroups = await db
      .select({
        id: groupsTable.id,
        name: groupsTable.name,
        description: groupsTable.description,
        owner_id: groupsTable.owner_id,
      })
      .from(groupsTable)
      .where(eq(groupsTable.team_id, teamId));

    return teamGroups;
  } catch (err) {
    console.log("Error fetching groups:", err);
    throw new Error("Failed to fetch groups");
  }
}

export async function getTeamGroupsWithCreds(
  teamId: string,
): Promise<SelectTeamGroupsWithCredentials[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const result = await db
      .select({
        group: {
          id: groupsTable.id,
          name: groupsTable.name,
          description: groupsTable.description,
          owner_id: groupsTable.owner_id,
        },
        credentials: {
          id: credentialsTable.id,
          name: credentialsTable.name,
          type: credentialsTable.type,
          team_id: credentialsTable.team_id,
          owner_id: credentialsTable.owner_id,
          group_id: credentialsTable.group_id,
        },
      })
      .from(groupsTable)
      .leftJoin(credentialsTable, eq(groupsTable.team_id, teamId));

    return result;
  } catch (err) {
    console.log("Error fetching groups");
    throw new Error("Failed to fetch groups");
  }
}
