"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserTeams, getTeams } from "@/lib/data/teams";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CreateTeamForm } from "../forms/CreateTeam";

export function TeamSwitcher({
  userTeams: initialTeams,
}: {
  userTeams: UserTeams[];
}) {
  const { isMobile } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const [userTeams, setUserTeams] = React.useState<UserTeams[]>(initialTeams);
  const [activeTeam, setActiveTeam] = React.useState(userTeams[0]);

  // Function to refresh the teams list
  const refreshTeams = React.useCallback(async () => {
    try {
      // Option 1: Using a server action to fetch fresh data
      const freshTeams = await getTeams();
      setUserTeams(freshTeams);

      // If the active team was just created, set it as active
      if (
        freshTeams.length > 0 &&
        (!activeTeam || freshTeams.length > userTeams.length)
      ) {
        setActiveTeam(freshTeams[freshTeams.length - 1]);
      }
    } catch (error) {
      console.error("Failed to refresh teams:", error);
    }
  }, [activeTeam, userTeams.length]);

  // Alternative approach: Update local state directly with the new team
  const handleTeamCreated = React.useCallback((newTeam: UserTeams) => {
    setUserTeams((prevTeams) => {
      const updatedTeams = [...prevTeams, newTeam];
      return updatedTeams;
    });
    setActiveTeam(newTeam);
    setOpen(false);
  }, []);

  if (!activeTeam) {
    return (
      <SidebarMenu>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <SidebarMenuItem className="cursor-pointer">
              Create Team
            </SidebarMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create team</DialogTitle>
            </DialogHeader>
            <CreateTeamForm
              onSuccess={(newTeam) => {
                handleTeamCreated(newTeam);
                // Alternatively, use refreshTeams();
              }}
            />
          </DialogContent>
        </Dialog>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <activeTeam.logo className="size-4" /> */}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.teamName}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {userTeams.map((team) => (
              <DropdownMenuItem
                key={team.teamName}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {/* <team.logo className="size-4 shrink-0" /> */}
                </div>
                {team.teamName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="gap-2 p-2 cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add team
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create team</DialogTitle>
                </DialogHeader>
                <CreateTeamForm
                  onSuccess={(newTeam) => {
                    handleTeamCreated(newTeam);
                    // Alternatively, use refreshTeams();
                  }}
                />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
