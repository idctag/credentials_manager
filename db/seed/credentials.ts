// seed/credentials.ts
import { v4 as uuidv4 } from "uuid";
// Make sure to import the correct Drizzle driver type and DBSchema
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Import all relevant tables and enums
import { credentials } from "../schema"; // Adjust import path
import { credentialTypeEnum } from "../schema/enums"; // Adjust import path
import { databaseCredentials } from "../schema/databaseCredentials";
import { envCredentials } from "../schema/envCredentials";
import { serverCredentials } from "../schema/serverCredentials";
import { serviceCredentials } from "../schema/serviceCredentials";

/**
 * Seeds sample credentials linked to the provided user, team, and group.
 * Creates entries in the base 'credentials' table and specific type tables.
 * @param db The Drizzle database instance.
 * @param userId The UUID of the user (owner).
 * @param teamId The UUID of the team the credential belongs to.
 * @param groupId The UUID of the group the credential belongs to.
 */
export async function seedCredentials(
  db: PostgresJsDatabase,
  userId: string,
  teamId: string,
  groupId: string,
) {
  console.log("Starting credentials seeding...");

  // Generate a unique ID for EACH base credential entry
  const dbBaseCredentialId = uuidv4();
  const envBaseCredentialId = uuidv4();
  const serverBaseCredentialId = uuidv4();
  const serviceBaseCredentialId = uuidv4();

  // --- Data for Base 'credentials' table entries ---
  // Each specific credential type needs a corresponding entry in the 'credentials' table
  const baseCredentialsData = [
    {
      // Database Credential Base
      id: dbBaseCredentialId,
      name: "Seeded Database Credential",
      type: "database" as (typeof credentialTypeEnum.enumValues)[number],
      team_id: teamId,
      owner_id: userId,
      group_id: groupId,
      // created_at and updated_at will default
    },
    {
      // Env Credential Base
      id: envBaseCredentialId,
      name: "Seeded .env Credential",
      type: "env" as (typeof credentialTypeEnum.enumValues)[number],
      team_id: teamId,
      owner_id: userId,
      group_id: groupId,
    },
    {
      // Server Credential Base
      id: serverBaseCredentialId,
      name: "Seeded Server Credential",
      type: "server" as (typeof credentialTypeEnum.enumValues)[number],
      team_id: teamId,
      owner_id: userId,
      group_id: groupId,
    },
    {
      // Service Credential Base
      id: serviceBaseCredentialId,
      name: "Seeded Service Credential",
      type: "service" as (typeof credentialTypeEnum.enumValues)[number],
      team_id: teamId,
      owner_id: userId,
      group_id: groupId,
    },
  ];

  // --- Data for Specific Credential Tables ---
  // These use the ID from the base credential entry as their primary/foreign key (credential_id)
  const databaseSpecificData = {
    credential_id: dbBaseCredentialId, // Link to the base credential
    name: "Seeded DB Details", // This name might be redundant if you use the base name
    description: "Details for the seeded database connection",
    connection_string: "postgresql://user:password@localhost:5432/seeded_db",
    databaseName: "seeded_db",
    username: "seeded_user",
    password: "seeded_password", // TODO: encrypt
  };

  const envSpecificData = {
    credential_id: envBaseCredentialId, // Link to the base credential
    name: "Seeded Env Details", // This name might be redundant
    description: "Sample environment variables",
    text: "MY_API_KEY=fakeapikey\nANOTHER_VAR=somevalue", // TODO: encrypt
  };

  const serverSpecificData = {
    credential_id: serverBaseCredentialId, // Link to the base credential
    // Note: Specific server credentials table uses varchar fields based on your schema
    name: "Tmaster1", // This name might be redundant
    description: "test server",
    server_address: "192.168.2.82",
    username: "tmaster1",
    password: "sysadmin123", // TODO: encrypt
  };

  const serviceSpecificData = {
    credential_id: serviceBaseCredentialId, // Link to the base credential
    // Note: Specific service credentials table uses varchar fields based on your schema
    name: "grafana", // This name might be redundant
    description: "Monitor server usage",
    url: "grafana.tanasoft.mn",
    username: "admin",
    password: "admin", // TODO: encrypt
  };

  try {
    console.log(`Inserting base credentials entries...`);
    // Insert all base credential entries in one go
    await db
      .insert(credentials)
      .values(baseCredentialsData)
      .onConflictDoNothing();

    console.log(`Inserting specific credential details...`);
    // Insert into the specific tables, linked by credential_id
    await db
      .insert(databaseCredentials)
      .values(databaseSpecificData)
      .onConflictDoNothing();
    await db
      .insert(envCredentials)
      .values(envSpecificData)
      .onConflictDoNothing();
    await db
      .insert(serverCredentials)
      .values(serverSpecificData)
      .onConflictDoNothing();
    await db
      .insert(serviceCredentials)
      .values(serviceSpecificData)
      .onConflictDoNothing();

    console.log("Credentials seeding complete!");
  } catch (error) {
    console.error(
      `Error seeding credentials for user ${userId}, team ${teamId}, group ${groupId}:`,
      error,
    );
    throw error;
  }
}
