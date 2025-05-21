"use server";

import { auth } from "@/auth";
import { CreateTeamSchema } from "@/components/forms/create-team";
import { db } from "@/db";
import { groupsTable, TeamRole, teamsTable, userTeamsTable } from "@/db/schema";
import { z } from "zod";
import { Status } from "./user";
import { and, eq } from "drizzle-orm";

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

type TeamUpdateData = {
  name: string;
  description: string;
  members: {
    user_id: string;
    role: TeamRole;
    email: string;
  }[];
};

export async function updateTeam(
  teamId: string,
  data: TeamUpdateData,
): Promise<Status> {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new Error("Login first");
    }
    return await db.transaction(async (tx) => {
      // Update team name and description
      await tx
        .update(teamsTable)
        .set({ name: data.name, description: data.description })
        .where(eq(teamsTable.id, teamId));

      // Fetch current members with a join to teamsTable
      const currentMembers = await tx
        .select({ userId: userTeamsTable.userId, role: userTeamsTable.role })
        .from(userTeamsTable)
        .innerJoin(teamsTable, eq(userTeamsTable.teamId, teamsTable.id))
        .where(eq(teamsTable.id, teamId));

      const currentMemberMap = new Map(
        currentMembers.map((member) => [member.userId, member.role]),
      );

      // Update member roles if they have changed
      for (const member of data.members) {
        const currentRole = currentMemberMap.get(member.user_id);
        if (currentRole && currentRole !== member.role) {
          await tx
            .update(userTeamsTable)
            .set({ role: member.role })
            .where(
              and(
                eq(userTeamsTable.teamId, teamId),
                eq(userTeamsTable.userId, member.user_id),
              ),
            );
        }
      }

      return {
        status: "success",
        id: teamId,
        message: "Team updated successfully",
      };
    });
  } catch (err) {
    console.error("Error updating team: ", err);
    return {
      status: "failed",
      message: `Failed to update team: ${JSON.stringify(err)}`,
    };
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
    throw new Error(`Failed to create team ${err}`);
  }
}

export async function removeMember(id: string): Promise<Status> {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new Error("Login first");
    }
    const result = await db
      .delete(userTeamsTable)
      .where(eq(userTeamsTable.userId, id))
      .returning({ id: userTeamsTable.userId });
    return {
      status: "success",
      id: result[0].id,
      message: `Member ${result[0].id} has been removed`,
    };
  } catch (err) {
    return { status: "failed", message: JSON.stringify(err) };
  }
}
export async function deleteTeam(teamId: string): Promise<Status> {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new Error("Login first");
    }

    return await db.transaction(async (tx) => {
      // Delete all group records associated with the team
      await tx.delete(groupsTable).where(eq(groupsTable.team_id, teamId));

      // Delete all user-team associations for this team
      await tx.delete(userTeamsTable).where(eq(userTeamsTable.teamId, teamId));

      // Delete the team
      await tx.delete(teamsTable).where(eq(teamsTable.id, teamId));

      return {
        status: "success",
        message: "Team deleted successfully",
      };
    });
  } catch (err) {
    console.error("Error deleting team: ", err);
    return {
      status: "failed",
      message: `Failed to delete team: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
