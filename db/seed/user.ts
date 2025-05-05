import { v4 as uuidv4 } from "uuid"; // Install uuid if you haven't: npm install uuid @types/uuid
import { AdapterAccountType } from "@auth/core/adapters"; // Import the type
import { accounts, users } from "../schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export async function seedGithubUser(db: PostgresJsDatabase, userId: string) {
  console.log("Starting database seeding for GitHub user...");

  const providerAccountId = "73417322";

  // Data for the user
  const userData = {
    id: userId,
    name: "idctag",
    email: "ochir.code@gmail.com",
    image: "https://avatars.githubusercontent.com/u/73417322?v=4",
  };

  // Data for the GitHub account link
  const accountData = {
    userId: userId,
    type: "oauth" as AdapterAccountType,
    provider: "github",
    providerAccountId: providerAccountId,
    refresh_token: null,
    access_token: "fake_github_access_token",
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90,
    token_type: "Bearer",
    scope: "read:user,user:email",
    id_token: null,
    session_state: null,
  };

  try {
    // Insert the user
    console.log(`Inserting user with ID: ${userId}`);
    await db.insert(users).values(userData).onConflictDoNothing();

    // Insert the account link
    console.log(`Inserting GitHub account link for user ID: ${userId}`);
    await db.insert(accounts).values(accountData).onConflictDoNothing();

    console.log("GitHub user seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection if necessary
    // await db.end(); // Uncomment if your db instance has an end method
  }
}
