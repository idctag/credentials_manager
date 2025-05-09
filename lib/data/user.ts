import { auth } from "@/auth";
import { FetchCredential } from "./credentials";
import { UserTeam } from "./teams";
import { db } from "@/db";
import {
  credentialsTable,
  groupsTable,
  teamsTable,
  userTeamsTable,
} from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { FetchGroupWithCredentials } from "./groups";

export type AllUserCredentialData = {
  teams: UserTeamWithData[];
};

export type UserTeamWithData = UserTeam & {
  groups: FetchGroupWithCredentials[];
  credentials: FetchCredential[];
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
            const groupCredentials = await db
              .select({
                id: credentialsTable.id,
                name: credentialsTable.name,
                owner_id: credentialsTable.owner_id,
              })
              .from(credentialsTable)
              .where(eq(credentialsTable.group_id, group.id));

            return {
              ...group,
              credentials: groupCredentials,
            };
          }),
        );
        const teamCredentials = await db
          .select({
            id: credentialsTable.id,
            name: credentialsTable.name,
            owner_id: credentialsTable.owner_id,
          })
          .from(credentialsTable)
          .where(
            and(
              eq(credentialsTable.team_id, team.id),
              isNull(credentialsTable.group_id),
            ),
          );
        return {
          ...team,
          groups: groupsWithCredentials,
          credentials: teamCredentials,
        };
      }),
    );
    return { teams: teamsWithData };
  } catch (err) {
    throw new Error("Failed to fetch User All credentials data");
  }
}
