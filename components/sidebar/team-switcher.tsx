"use client";
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import useTeamStore from "@/store/team-store";
import { UserTeam } from "@/lib/data/teams";
import { useEffect } from "react";
import { getTeamGroupsWithCreds } from "@/lib/data/groups";
import useGroupStore from "@/store/group-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function TeamSwitcher({
  initialTeams,
}: {
  initialTeams: UserTeam[];
}) {
  const { isMobile } = useSidebar();
  const { teams, setTeams, setActiveTeam, activeTeam } = useTeamStore();
  const { setGroups } = useGroupStore();
  useEffect(() => {
    if (initialTeams.length > 0) {
      setTeams(initialTeams);
      setActiveTeam(initialTeams[0]);
    }
  }, [initialTeams, setTeams, setActiveTeam]);

  useEffect(() => {
    async function fetchGroups() {
      if (activeTeam?.id) {
        try {
          const teamGroups = await getTeamGroupsWithCreds(activeTeam.id);
          setGroups(teamGroups);
        } catch (error) {
          setGroups([]);
        }
      } else {
        setGroups([]);
      }
    }
    fetchGroups();
  }, [activeTeam, setGroups]);

  return (
    <Dialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam?.name || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-widh] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DialogTrigger className="flex gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add team
                  </div>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>Form for adding a team</div>
      </DialogContent>
    </Dialog>
  );
}
