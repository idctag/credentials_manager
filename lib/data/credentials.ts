"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { credentialsTable, CredentialType } from "@/db/schema";
import { databaseCredentialTable } from "@/db/schema/database_credentials";
import { serverCredentialTable } from "@/db/schema/server_credentials";
import { and, eq, isNull } from "drizzle-orm";
import { Status } from "./user";

export type FetchCredentialType = {
  id: string;
  name: string;
  owner_id?: string | null;
  team_id?: string | null;
  group_id?: string | null;
  servers?: ServerCredentialType[] | null;
  databases?: DatabaseCredentialType[] | null;
};

export type ServerCredentialType = {
  name: string | null;
  username: string | null;
  password: string | null;
  server_address: string | null;
  description: string | null;
  credential_id: string | null;
  type: CredentialType;
};

export type DatabaseCredentialType = {
  name: string | null;
  username: string | null;
  password: string | null;
  connection_string: string | null;
  description: string | null;
  credential_id: string | null;
  type: CredentialType;
};

export async function getGroupCredentials(
  grouId: string,
): Promise<FetchCredentialType[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const groupCredentials = await db
      .select({ id: credentialsTable.id, name: credentialsTable.name })
      .from(credentialsTable)
      .where(eq(credentialsTable.group_id, grouId));

    const groupsWithCredentials: FetchCredentialType[] = await Promise.all(
      groupCredentials.map(async (cred) => {
        const credentials = await getFullCredential(cred.id);
        return {
          ...cred,
          ...credentials,
        };
      }),
    );

    return groupsWithCredentials;
  } catch (err) {
    console.log("Error fetching credentials:", err);
    throw new Error("Failed to fetch credentials");
  }
}

export async function getTeamCredentials(
  teamId: string,
): Promise<FetchCredentialType[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Failed to fetch credentials");
    }
    const teamCredentials = await db
      .select({
        id: credentialsTable.id,
        name: credentialsTable.name,
        owner_id: credentialsTable.owner_id,
      })
      .from(credentialsTable)
      .where(
        and(
          eq(credentialsTable.team_id, teamId),
          isNull(credentialsTable.group_id),
        ),
      );

    const result = await Promise.all(
      teamCredentials.map(async (cred) => {
        const fullCred = await getFullCredential(cred.id);
        return {
          ...cred,
          ...fullCred,
        };
      }),
    );

    return result;
  } catch (err) {
    console.log("Error fetching credentials:", err);
    throw new Error("Failed to fetch credentials");
  }
}

export async function getDatabaseCredential(
  credentialId: string,
): Promise<DatabaseCredentialType[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Must be logged");
    }
    const databasCredentials = await db
      .select()
      .from(databaseCredentialTable)
      .where(eq(databaseCredentialTable.credential_id, credentialId));
    if (databasCredentials) {
      return databasCredentials;
    } else {
      return [];
    }
  } catch (err) {
    throw new Error("Failed to fetch database credentials");
  }
}

export async function getServerCredential(
  credentialId: string,
): Promise<ServerCredentialType[]> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Must be logged");
    }
    const result = await db
      .select()
      .from(serverCredentialTable)
      .where(eq(serverCredentialTable.credential_id, credentialId));

    return result;
  } catch (err) {
    throw new Error("Failed to fetch server credentials");
  }
}

export async function getFullCredential(
  credentialId: string,
): Promise<FetchCredentialType | null> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Must be logged in");
    }
    const cred = await db
      .select()
      .from(credentialsTable)
      .where(eq(credentialsTable.id, credentialId));
    if (cred.length == 0) {
      return null;
    }
    const databaseCreds = await getDatabaseCredential(credentialId);
    const serverCreds = await getServerCredential(credentialId);

    const result = {
      ...cred[0],
      servers: serverCreds,
      databases: databaseCreds,
    };
    return result;
  } catch (err) {
    throw new Error("Failed to fetch credentials");
  }
}

export async function deleteCredential(credentialId: string): Promise<Status> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Must be logged in");
    }

    const name = await db
      .delete(credentialsTable)
      .where(eq(credentialsTable.id, credentialId))
      .returning({ name: credentialsTable.name });

    return {
      status: "success",
      message: `credential ${name[0].name} has been deleted`,
    };
  } catch (err) {
    return { status: "failed", message: JSON.stringify(err) };
  }
}
