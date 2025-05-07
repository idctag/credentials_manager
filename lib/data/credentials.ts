"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export type SelectTeamCredential = {
  id: string;
  name: string;
  owner_id: string | null;
  type: "db_connection" | "server";
};

export async function getTeamCredentials(
  teamId: string,
): Promise<SelectTeamCredential[]> {
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
        type: credentialsTable.type,
      })
      .from(credentialsTable)
      .where(eq(credentialsTable.team_id, teamId));

    return teamCredentials;
  } catch (err) {
    console.log("Error fetching credentials:", err);
    throw new Error("Failed to fetch credentials");
  }
}
