"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { credentialsTable } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export type FetchCredential = {
  id: string;
  name: string;
  owner_id: string | null;
};

export async function getGroupCredentials(
  grouId: string,
): Promise<FetchCredential[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const groupCredentials = await db
      .select({
        id: credentialsTable.id,
        name: credentialsTable.name,
        owner_id: credentialsTable.owner_id,
      })
      .from(credentialsTable)
      .where(eq(credentialsTable.group_id, grouId));

    return groupCredentials;
  } catch (err) {
    console.log("Error fetching credentials:", err);
    throw new Error("Failed to fetch credentials");
  }
}

export async function getTeamCredentials(
  teamId: string,
): Promise<FetchCredential[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const teamCredentials = await db
      .select({
        id: credentialsTable.id,
        name: credentialsTable.name,
        owner_id: credentialsTable.owner_id,
      })
      .from(credentialsTable)
      .where(
        and(
          eq(credentialsTable.team_id, teamId),
          isNull(credentialsTable.group_id),
        ),
      );

    return teamCredentials;
  } catch (err) {
    console.log("Error fetching credentials:", err);
    throw new Error("Failed to fetch credentials");
  }
}
