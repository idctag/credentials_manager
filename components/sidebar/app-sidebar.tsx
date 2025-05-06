"use client";

import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { UserTeams } from "@/lib/data/teams";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userTeams: UserTeams[];
}

export function AppSidebar({ userTeams, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher userTeams={userTeams} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain groups={userTeams[0].groups} /> */}
        {/* <NavCredentials creds={userTeams[0].credentials} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
