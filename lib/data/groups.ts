"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { groupsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FetchCredential, getGroupCredentials } from "./credentials";
import { z } from "zod";
import { CreateGroupSchema } from "@/components/sidebar/components/creat-group-button";
import { toast } from "sonner";

export type Team = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string | null;
};

export type FetchGroup = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  team_id: string;
};

export type GroupWithCredentials = FetchGroup & {
  credentials: FetchCredential[] | null;
};

export async function getTeamGroups(teamId: string): Promise<FetchGroup[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch groups");
    }
    const groups = await db
      .select()
      .from(groupsTable)
      .where(eq(groupsTable.team_id, teamId));
    return groups;
  } catch (err) {
    throw new Error("Failed to fetch groups");
  }
}

export async function getTeamGroupsWithCreds(
  teamId: string,
): Promise<GroupWithCredentials[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch groups");
    }
    const groups = await getTeamGroups(teamId);
    const groupsWithCredentials = await Promise.all(
      groups.map(async (group) => {
        const groupCredentials = await getGroupCredentials(group.id);
        return {
          ...group,
          credentials: groupCredentials.length > 0 ? groupCredentials : null,
        };
      }),
    );
    return groupsWithCredentials;
  } catch (err) {
    throw new Error("Failed to fetch groups");
  }
}

export async function createGroup(
  formData: z.infer<typeof CreateGroupSchema>,
  activeTeamId: string,
): Promise<FetchGroup> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const result: FetchGroup[] = await db
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
        team_id: groupsTable.team_id,
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

export async function deleteGroup(groupId: string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to delete group");
    }
    await db.delete(groupsTable).where(eq(groupsTable.id, groupId));
  } catch (err) {
    throw new Error("Failed to delete group");
  }
}
