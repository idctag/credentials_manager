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
import { getAllUserCredentialsData } from "@/lib/data/user";

export default function AppSidebar() {
  const { setTeams, setActiveTeam } = useTeamStore();
  useEffect(() => {
    async function fetchData() {
      const response = await getAllUserCredentialsData();
      setTeams(response.teams);
      const newActiveTeam = response.teams[0] || null;
      setActiveTeam(newActiveTeam);
      console.log(response);
    }
    fetchData();
  }, [setTeams, setActiveTeam]);
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
