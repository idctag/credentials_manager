import { db } from "..";
import { schema } from "../schema";
import { reset } from "drizzle-seed";
import { seedGithubUser } from "./user";
import * as dotenv from "dotenv";

dotenv.config({ path: "./../../.env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found in .env.local");
}

async function main() {
  const mainSeededUserId = "00000000-0000-0000-0000-000000000001";
  await reset(db, schema);
  await seedGithubUser(db, mainSeededUserId);
}

main();
