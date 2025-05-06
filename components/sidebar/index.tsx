import { getTeams, UserTeams } from "@/lib/data/teams";
import { AppSidebar } from "./app-sidebar";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default async function SideBarComp() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userTeams: UserTeams[] = await getTeams(session.user.id);
  return <AppSidebar userTeams={userTeams} />;
}
