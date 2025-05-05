import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { db } from "./db";
import { accounts, sessions, users } from "./db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [Google, GitHub],
  callbacks: {
    authorized: ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
  },
});
