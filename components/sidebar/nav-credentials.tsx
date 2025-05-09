"use client";

import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useCredentialsStore from "@/store/credentials-store";
import Link from "next/link";
import useTeamStore from "@/store/team-store";
import { useEffect } from "react";
import { getTeamCredentials } from "@/lib/data/credentials";

export function NavCredentials() {
  const { isMobile } = useSidebar();
  const { credentials, setCredentials } = useCredentialsStore();
  const { activeTeam } = useTeamStore();
  useEffect(() => {
    async function fetchCredentials() {
      if (activeTeam && activeTeam.id) {
        try {
          const result = await getTeamCredentials(activeTeam.id);
          setCredentials(result);
        } catch (err) {
          setCredentials([]);
        }
      } else {
        setCredentials([]);
      }
    }
    fetchCredentials();
  }, [activeTeam]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Credentials</SidebarGroupLabel>
      <SidebarMenu>
        {credentials.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href="#">
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
