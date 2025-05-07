import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add user.id to the session
    } & DefaultSession["user"];
  }
}
