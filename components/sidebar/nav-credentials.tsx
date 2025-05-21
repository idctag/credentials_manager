"use client";

import { Folder, MoreHorizontal, Trash2 } from "lucide-react";

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
import Link from "next/link";
import useTeamStore from "@/store/teams";
import { useCredentialStore } from "@/store";
import { deleteCredential } from "@/lib/data/credentials";
import { toast } from "sonner";

export function NavCredentials() {
  const { isMobile } = useSidebar();
  const { activeTeam } = useTeamStore();
  const { removeCredential } = useCredentialStore();
  async function onDelete(id: string) {
    const res = await deleteCredential(id);
    if (res.status === "success") {
      toast.success(res.message);
      removeCredential(id);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Credentials</SidebarGroupLabel>
      <SidebarMenu>
        {activeTeam?.credentials
          ? activeTeam.credentials.map((item) => (
              <SidebarMenuItem key={item.id}>
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
                      <span>View Credential</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 hover:cursor-pointer"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Credential</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))
          : null}
      </SidebarMenu>
    </SidebarGroup>
  );
}
