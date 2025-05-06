import { db } from "@/db";
import { teamsTable, userTeamsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export type UserTeams = {
  teamId: string;
  teamName: string;
  teamDescription: string | null;
  role: "admin" | "member";
};

export async function getTeams(userId: string): Promise<UserTeams[]> {
  try {
    const teams = await db
      .select({
        teamId: teamsTable.id,
        teamName: teamsTable.name,
        teamDescription: teamsTable.description,
        role: userTeamsTable.role,
      })
      .from(userTeamsTable)
      .innerJoin(teamsTable, eq(userTeamsTable.teamId, teamsTable.id))
      .where(eq(userTeamsTable.userId, userId));

    return teams;
  } catch (err) {
    console.log("Error fetching teams:", err);
    throw new Error("Failed to fetch teams");
  }
}
