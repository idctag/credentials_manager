"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { groupsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FetchCredentialType } from "./credentials";
import { z } from "zod";
import { Status } from "./user";
import { CreateGroupSchema } from "@/components/forms/create-group-button";

export type FetchGroup = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  team_id: string;
};

export type GroupWithCredentials = FetchGroup & {
  credentials: FetchCredentialType[] | null;
};

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
    throw new Error(`Failed to create group: ${err}`);
  }
}

export async function deleteGroup(groupId: string): Promise<Status> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to delete group");
    }
    const name = await db
      .delete(groupsTable)
      .where(eq(groupsTable.id, groupId))
      .returning({ name: groupsTable.name });
    return {
      status: "success",
      message: `Group ${JSON.stringify(name[0].name)} has been deleted successfully`,
    };
  } catch (err) {
    return { status: "failed", message: `Failed to deleted group ${err}` };
  }
}
