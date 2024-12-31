"use client";

import { Board } from "@prisma/client";
import { ChevronRight, Clipboard } from "lucide-react";

import { useParams } from "react-router";
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
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import { cn } from "~/lib/utils";

export function NavMain({ boards }: { boards: Board[] }) {
  const { id } = useParams(); // Get the current board ID from the URL params

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>
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
                  <SidebarMenuSubItem key={board.id} className="flex flex-row">
                    <SidebarMenuSubButton asChild>
                      <a
                        href={`/board/${board.id}/${board.name}`}
                        className={cn("flex-1", {
                          "font-bold": board.id === Number(id),
                        })}
                      >
                        <div
                          className="w-5 h-5 rounded-sm"
                          style={{
                            background: `${
                              board.backgroundColor ?? "secondary"
                            }`.startsWith("linear-gradient")
                              ? `${board.backgroundColor ?? "secondary"}`
                              : `var(--color-${`${
                                  board.backgroundColor ?? "secondary"
                                }`})`,
                          }}
                        />
                        <span>{board.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                    <FavoriteBoard
                      boardId={board.id}
                      isFavorite={board.isFavorite}
                    />
                    <BoardActionDropdown boardId={board.id} key={board.id} />
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
