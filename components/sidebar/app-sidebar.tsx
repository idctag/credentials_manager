"use client";
import { UserTeam } from "@/lib/data/teams";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { NavUser } from "./footer";
import TeamSwitcher from "./team-switcher";

export default function AppSidebar({
  initialTeams,
}: {
  initialTeams: UserTeam[];
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher initialTeams={initialTeams} />
      </SidebarHeader>
      <SidebarContent>Content</SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
