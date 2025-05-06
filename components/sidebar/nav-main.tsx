"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SelectGroup } from "@/lib/data/teams";

export function NavMain({ groups }: { groups: SelectGroup[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Groups</SidebarGroupLabel>
      <SidebarMenu>
        {groups.map((item) => (
          <Collapsible key={item.name} asChild defaultOpen={false}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.name}>
                <a href="#">
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              {item.credentials?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.credentials?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton asChild>
                            <a href="#">
                              <span>{subItem.name}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
