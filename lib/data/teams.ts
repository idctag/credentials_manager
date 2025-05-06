"use server";

import { auth } from "@/auth";
import { createTeamSchema } from "@/components/forms/CreateTeam";
import { db } from "@/db";
import { teamsTable, userTeamsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type UserTeams = {
  teamId: string;
  teamName: string;
  teamDescription: string | null;
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
        teamId: teamsTable.id,
        teamName: teamsTable.name,
        teamDescription: teamsTable.description,
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

export async function createTeam(formData: z.infer<typeof createTeamSchema>) {
  try {
    const session = await auth();
    if (!session?.user.id) {
      return { success: false, error: "User not authenticated" };
    }

    const userId = session.user.id;
    const [newTeam] = await db
      .insert(teamsTable)
      .values({
        name: formData.name,
        description: formData.description,
        owner_id: userId,
      })
      .returning({ id: teamsTable.id });
    if (!newTeam) {
      return { success: false, error: "Failed to create team" };
    }

    await db.insert(userTeamsTable).values({
      userId,
      teamId: newTeam.id,
      role: "admin",
    });
    return { success: true, teamId: newTeam.id };
  } catch (err) {
    console.log("Error creating a team", err);
    throw new Error("Failed to create a team");
  }
}
