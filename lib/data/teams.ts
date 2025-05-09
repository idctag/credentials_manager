"use server";

import { auth } from "@/auth";
import { CreateTeamSchema } from "@/components/forms/create-team";
import { db } from "@/db";
import { TeamRole, teamsTable, userTeamsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type UserTeam = {
  id: string;
  name: string;
  description: string | null;
  role: TeamRole;
};

export type InsertTeam = {
  userId: string;
  name: string;
  description?: string;
};

export async function getTeams(): Promise<UserTeam[]> {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new Error("Login first");
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

export async function createTeam(
  formData: z.infer<typeof CreateTeamSchema>,
): Promise<UserTeam> {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new Error("Login first");
    }
    const result = await db
      .insert(teamsTable)
      .values({ ...formData, owner_id: session.user.id })
      .returning({
        id: teamsTable.id,
        name: teamsTable.name,
        description: teamsTable.description,
      });
    const team = result[0];
    if (!team) {
      throw new Error("Failed to create team");
    }
    const createdRole = await db
      .insert(userTeamsTable)
      .values({
        teamId: team.id,
        userId: session.user.id,
        role: "admin" as TeamRole,
      })
      .returning({ role: userTeamsTable.role });
    const role = createdRole[0];
    if (!role) {
      throw new Error("Failed to create relation");
    }
    const response = {
      ...team,
      role: role.role,
    };
    return response;
  } catch (err) {
    throw new Error("Failed to create team");
  }
}
