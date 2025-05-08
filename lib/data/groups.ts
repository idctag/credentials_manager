"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { credentialsTable, groupsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SelectTeamCredential } from "./credentials";
import { z } from "zod";
import { CreateGroupSchema } from "@/components/forms/create-group";

export type Team = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string | null;
};

export type TeamGroupsWithCreds = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string | null;
  credentials: SelectTeamCredential[] | null;
};

export async function getTeamGroupsWithCreds(
  teamId: string,
): Promise<TeamGroupsWithCreds[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const groups = await db
      .select({
        id: groupsTable.id,
        name: groupsTable.name,
        description: groupsTable.description,
        owner_id: groupsTable.owner_id,
      })
      .from(groupsTable)
      .where(eq(groupsTable.team_id, teamId));
    const credentials = await db
      .select({
        id: credentialsTable.id,
        name: credentialsTable.name,
        type: credentialsTable.type,
        team_id: credentialsTable.team_id,
        owner_id: credentialsTable.owner_id,
        group_id: credentialsTable.group_id,
      })
      .from(credentialsTable)
      .where(eq(credentialsTable.team_id, teamId));

    const result: TeamGroupsWithCreds[] = groups.map((group) => ({
      ...group,
      credentials:
        credentials.filter((cred) => cred.group_id === group.id) || null,
    }));

    return result;
  } catch (err) {
    throw new Error("Failed to fetch groups");
  }
}

export async function createGroup(
  formData: z.infer<typeof CreateGroupSchema>,
  activeTeamId: string,
): Promise<Team> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const result: Team[] = await db
      .insert(groupsTable)
      .values({
        name: formData.name,
        description: formData.description,
        team_id: activeTeamId,
        owner_id: session.user.id,
      })
      .returning({
        id: groupsTable.id,
        name: groupsTable.name,
        description: groupsTable.description,
        owner_id: groupsTable.owner_id,
      });
    const group = result[0];
    if (!group) {
      throw new Error("Failed to create group");
    }
    return group;
  } catch (err) {
    throw new Error("Failed to create group");
  }
}
