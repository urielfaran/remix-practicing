import { Board } from "@prisma/client";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import { useParams } from "react-router";

interface FavoriteBoardsProps {
  boards: Board[];
}

export function FavoriteBoards({ boards }: FavoriteBoardsProps) {
  const { id } = useParams(); // Get the current board ID from the URL params

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {boards.map((board) => (
          <SidebarMenuItem key={board.name} className="flex flex-row">
            <SidebarMenuButton asChild>
              <a
                href={`/board/${board.id}/${board.name}`}
                className={board.id === Number(id) ? "font-bold" : ""}
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
            </SidebarMenuButton>
            <FavoriteBoard boardId={board.id} isFavorite={board.isFavorite} />
            <BoardActionDropdown boardId={board.id} key={board.id} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
