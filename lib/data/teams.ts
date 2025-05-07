"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { teamsTable, userTeamsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export type UserTeams = {
  id: string;
  name: string;
  description: string | null;
  role: "admin" | "member";
};

export type InsertTeam = {
  userId: string;
  name: string;
  description?: string;
};

export async function getTeams(): Promise<UserTeams[]> {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new Error("Failed to fetch teams");
    }
    const teams = await db
      .select({
        id: teamsTable.id,
        name: teamsTable.name,
        description: teamsTable.description,
        role: userTeamsTable.role,
      })
      .from(userTeamsTable)
      .innerJoin(teamsTable, eq(userTeamsTable.teamId, teamsTable.id))
      .where(eq(userTeamsTable.userId, session.user.id));

    return teams;
  } catch (err) {
    console.log("Error fetching teams:", err);
    throw new Error("Failed to fetch teams");
  }
}
