// seed/organization.ts
import { v4 as uuidv4 } from "uuid";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { teams, teamMembers, groups, teamGroups } from "../schema"; // Adjust import path
import { teamRoleEnum } from "../schema/enums"; // Adjust import path to your enums file

/**
 * Seeds a team, a group, links the user as a team member, and links the group to the team.
 * @param db The Drizzle database instance.
 * @param userId The UUID of the user to assign as owner and member.
 * @returns An object containing the created teamId and groupId.
 */

export async function seedOrganization(
  db: PostgresJsDatabase,
  userId: string,
): Promise<{ teamId: string; groupId: string }> {
  console.log("Starting organization seeding...");

  const teamId = uuidv4();
  const groupId = uuidv4();

  const teamData = {
    id: teamId,
    name: "Seeded Team",
    description: "A sample team created during seeding.",
    owner_id: userId, // Link to the seeded user
  };

  const groupData = {
    id: groupId,
    name: "Seeded Group",
    desription: "A sample group created during seeding.",
    owner_id: userId, // Link to the seeded user
  };

  const teamMemberData = {
    team_id: teamId,
    user_id: userId, // Link the user to the team
    role: "admin" as (typeof teamRoleEnum.enumValues)[number], // Assign a role, e.g., 'admin' or 'member'
  };

  const teamGroupData = {
    team_id: teamId,
    group_id: groupId, // Link the group to the team
  };

  try {
    console.log(`Inserting team with ID: ${teamId} owned by user ${userId}`);
    await db.insert(teams).values(teamData).onConflictDoNothing();

    console.log(`Inserting group with ID: ${groupId} owned by user ${userId}`);
    await db.insert(groups).values(groupData).onConflictDoNothing();

    console.log(`Linking user ${userId} to team ${teamId} as admin`);
    // For join tables like teamMembers, you might want to replace rather than do nothing on conflict
    // If conflict on (team_id, user_id), do update role? Or just do nothing?
    // For a simple seed, onConflictDoNothing is fine if you only seed this link once per user/team
    await db.insert(teamMembers).values(teamMemberData).onConflictDoNothing();

    console.log(`Linking group ${groupId} to team ${teamId}`);
    // Same consideration as teamMembers for onConflict strategy
    await db.insert(teamGroups).values(teamGroupData).onConflictDoNothing();

    console.log("Organization seeding complete!");
    return { teamId, groupId }; // Return the generated IDs
  } catch (error) {
    console.error(`Error seeding organization for user ${userId}:`, error);
    throw error;
  }
}
