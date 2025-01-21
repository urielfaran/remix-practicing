import { Prisma, User } from "@prisma/client";
import { Link } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { HomeHeader } from "./HomeHeader";
import { FavoriteBoards } from "./NavFavorites";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { SharedBoards } from "./SharedBoards";

export type BoardWithRelations = Prisma.BoardGetPayload<{
  include: {
    UserBoardRelation: true;
  };
}>;

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  ownedBoards: BoardWithRelations[];
  sharedBoards: BoardWithRelations[];
  favoriteBoards: BoardWithRelations[];
  user: User;
}

export function AppSidebar({
  ownedBoards,
  sharedBoards,
  favoriteBoards,
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link to={"/"}>
          <HomeHeader />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain boards={ownedBoards} />
        <FavoriteBoards boards={favoriteBoards} />
        <SharedBoards boards={sharedBoards} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
