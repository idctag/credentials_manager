import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Disable prefetch as it is not supported for "Transaction" pool mode in Supabase
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

// This is a workaround for hot reloading in development with Next.js
// See: https://orm.drizzle.team/docs/other-drivers#postgresjs#hot-reloading
declare global {
  var db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

if (process.env.NODE_ENV !== "production") {
  if (!global.db) {
    global.db = db;
  }
  // Use the cached connection in development
  // This is important to avoid creating new connections on every hot reload
  (db as any) = global.db;
}
