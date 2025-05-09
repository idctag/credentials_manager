"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { NavUser } from "./footer";
import TeamSwitcher from "./team-switcher";
import { NavMain } from "./nav-group";
import { NavCredentials } from "./nav-credentials";
import useTeamStore from "@/store/team-store";
import { useEffect } from "react";
import { auth } from "@/auth";

export default function AppSidebar() {
  const { activeTeam, setTeams } = useTeamStore();
  useEffect(() => {
    async function fetchData() {
      try (

      )
    }
  })
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavCredentials />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
