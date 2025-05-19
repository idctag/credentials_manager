import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import Link from "next/link";
import { ChevronRight, Folder } from "lucide-react";
import useTeamStore from "@/store/teams";

export function NavMain() {
  const { activeTeam } = useTeamStore();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Groups</SidebarGroupLabel>
      <SidebarMenu>
        {activeTeam?.groups
          ? activeTeam.groups.map((group) => (
              <Collapsible key={group.id} asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={group.description || group.name}
                  >
                    <Link href={"#"}>
                      <Folder />
                      <span>{group.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {group.credentials?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {group.credentials.map((cred) => (
                            <SidebarMenuSubItem key={cred.id}>
                              <SidebarMenuButton asChild>
                                <Link href="#">
                                  <span>{cred.name}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))
          : null}
      </SidebarMenu>
    </SidebarGroup>
  );
}
