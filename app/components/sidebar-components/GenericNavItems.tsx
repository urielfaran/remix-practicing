import { Board } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { PropsWithChildren } from "react";
import { useParams } from "react-router";
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
import FavoriteBoard from "../action-buttons/FavoriteBoard";
import BoardActionDropdown from "../dropdowns/BoardActionDropdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "~/lib/utils";

interface GenericNavItemsProps extends PropsWithChildren {
  boards: Board[];
  title: string;
  icon: JSX.Element;
}

function GenericNavItems({ boards, title, icon }: GenericNavItemsProps) {
  const { id } = useParams(); 

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="flex items-center w-full">
                {icon}
                <span>{title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {boards.map((board) => {
                  const isFavorite = true
                    // board.UserBoardRelation[0]?.isFavorite;

                  return (
                    <SidebarMenuSubItem
                      key={board.id}
                      className={cn(
                        "flex flex-row hover:bg-muted transition-colors duration-300",
                        {
                          "bg-muted-foreground/40": board.id === Number(id),
                        }
                      )}
                    >
                      <SidebarMenuSubButton
                        asChild
                        className="hover:bg-inherit mt-1 focus-visible:bg-inherit"
                      >
                        <a
                          href={`/board/${board.id}/${board.name}`}
                          className={cn("flex-1", {
                            "font-bold": board.id === Number(id),
                          })}
                        >
                          <div
                            className="w-5 h-5 rounded-sm border-2"
                            style={{
                              ...(board.backgroundColor &&
                              board.backgroundColor.startsWith("url")
                                ? {
                                    backgroundImage: board.backgroundColor,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                  }
                                : {
                                    background:
                                      board.backgroundColor || "secondary",
                                  }),
                            }}
                          />

                          <span>{board.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                      <FavoriteBoard
                        boardId={board.id}
                        isFavorite={isFavorite} // Pass the correct isFavorite value here
                      />
                      <BoardActionDropdown boardId={board.id} key={board.id} />
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default GenericNavItems;
