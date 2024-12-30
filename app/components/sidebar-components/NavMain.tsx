"use client";

import { Board } from "@prisma/client";
import { ChevronRight, Clipboard } from "lucide-react";
import { useLocation } from "@remix-run/react"; // import to access current location

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import { useParams } from "react-router";

export function NavMain({ boards }: { boards: Board[] }) {
  const { id } = useParams(); // Get the current board ID from the URL params

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="flex items-center w-full">
                <Clipboard />
                <span>{"Boards"}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {boards?.map((board) => (
                  <SidebarMenuSubItem key={board.id}>
                    <SidebarMenuSubButton asChild>
                      <a
                        href={`/board/${board.id}/${board.name}`}
                        className={board.id === Number(id) ? "font-bold" : ""}
                      >
                        <span>{board.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
