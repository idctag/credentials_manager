"use client";

import * as React from "react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-credentials";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Vix2",
      logo: GalleryVerticalEnd,
      navMain: [
        {
          title: "Server",
          url: "#",
          isActive: true,
          items: [
            {
              title: "jboss",
              url: "#",
            },
            {
              title: "database prod",
              url: "#",
            },
          ],
        },
        {
          title: "Front",
          url: "#",
          isActive: true,
          items: [
            {
              title: "env",
              url: "#",
            },
            {
              title: "admin",
              url: "#",
            },
          ],
        },
      ],
    },
    {
      name: "Mindx",
      logo: AudioWaveform,
      navMain: [
        {
          title: "Server",
          url: "#",
          isActive: true,
          items: [
            {
              title: ".m2",
              url: "#",
            },
            {
              title: "database mindx prod",
              url: "#",
            },
          ],
        },
        {
          title: "Front",
          url: "#",
          isActive: true,
          items: [
            {
              title: "admin",
              url: "#",
            },
            {
              title: "service",
              url: "#",
            },
          ],
        },
      ],
    },
    {
      name: "Servers",
      logo: Command,
      navMain: [
        {
          title: "unitel",
          url: "#",
          isActive: true,
          items: [
            {
              title: "tmaster",
              url: "#",
            },
            {
              title: "ninja",
              url: "#",
            },
          ],
        },
      ],
    },
  ],
  credentials: [
    {
      name: "vix2 database prod",
      url: "#",
    },
    {
      name: "mindx admin",
      url: "#",
    },
    {
      name: "grafana",
      url: "#",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.teams[0].navMain} />
        <NavProjects projects={data.credentials} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
