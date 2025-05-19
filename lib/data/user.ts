"use server";

import { auth } from "@/auth";
import { UserTeam } from "./teams";
import { db } from "@/db";
import { groupsTable, teamsTable, userTeamsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GroupWithCredentials } from "./groups";
import {
  FetchCredentialType,
  getGroupCredentials,
  getTeamCredentials,
} from "./credentials";

export type Status = {
  status: "failed" | "success";
  message?: string;
  id?: string;
};

export type AllUserCredentialData = {
  teams: UserTeamWithData[];
};

export type UserTeamWithData = UserTeam & {
  groups: GroupWithCredentials[];
  credentials: FetchCredentialType[];
};

export async function getAllUserCredentialsData(): Promise<AllUserCredentialData> {
  try {
    const session = await auth();
    if (!session?.user.id) {
      throw new Error("Login first");
    }
    const userTeams = await db
      .select({
        id: teamsTable.id,
        name: teamsTable.name,
        owner_id: teamsTable.owner_id,
        description: teamsTable.description,
        role: userTeamsTable.role,
      })
      .from(userTeamsTable)
      .innerJoin(teamsTable, eq(userTeamsTable.teamId, teamsTable.id))
      .where(eq(userTeamsTable.userId, session.user.id));

    const teamsWithData: UserTeamWithData[] = await Promise.all(
      userTeams.map(async (team) => {
        const groups = await db
          .select({
            id: groupsTable.id,
            name: groupsTable.name,
            team_id: groupsTable.team_id,
            description: groupsTable.description,
            owner_id: groupsTable.owner_id,
          })
          .from(groupsTable)
          .where(eq(groupsTable.team_id, team.id));
        const groupsWithCredentials = await Promise.all(
          groups.map(async (group) => {
            const groupCredentials = await getGroupCredentials(group.id);

            return {
              ...group,
              credentials: groupCredentials,
            };
          }),
        );
        const teamCredentials = await getTeamCredentials(team.id);
        return {
          ...team,
          groups: groupsWithCredentials,
          credentials: teamCredentials,
        };
      }),
    );
    return { teams: teamsWithData };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch User All credentials data");
  }
}
