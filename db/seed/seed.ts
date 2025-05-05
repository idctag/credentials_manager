import { sql } from "drizzle-orm";
import { db } from "..";
import { seedGithubUser } from "./user";

async function main() {
  console.log("Starting database seeding...");

  try {
    await db.execute(sql`TRUNCATE TABLE "account" CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE "session" CASCADE;`);
    await db.execute(sql`TRUNCATE TABLE "users" CASCADE;`);

    console.log("Tables truncated.");
    await seedGithubUser(db);
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
