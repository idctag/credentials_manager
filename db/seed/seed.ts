import { sql } from "drizzle-orm";
import { db } from "..";
import { seedGithubUser } from "./user";
import { seedOrganization } from "./organization";
import { seedCredentials } from "./credentials";

async function main() {
  console.log("Starting database seeding...");
  const mainSeededUserId = "00000000-0000-0000-0000-000000000001";
  try {
    await db.execute(sql`TRUNCATE TABLE env_credentials CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE server_credentials CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE service_credentials CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE database_credentials CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE credentials CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE team_groups CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE team_members CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE teams CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE groups CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE "account" CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE "session" CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE "users" CASCADE;`);
    console.log("Tables truncated.");

    // 1. seed main user
    await seedGithubUser(db, mainSeededUserId);
    // 2. seed organization data (team, group, members)
    const { teamId, groupId } = await seedOrganization(db, mainSeededUserId);
    // 3. seed credentials
    await seedCredentials(db, mainSeededUserId, teamId, groupId);

    console.log("Seed complete!");
  } catch (error) {
    console.log("An error occured", error);
    process.exit(1);
  } finally {
    console.log("Database connection closed");
    process.exit(0);
  }
}

main();
