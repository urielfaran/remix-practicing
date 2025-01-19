import { Outlet } from "react-router";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import Breadcrumbs from "~/components/Breadcrumbs";
import Logout from "~/components/action-buttons/Logout";
import { ModeToggle } from "~/components/mode-toggle";
import { AppSidebar } from "~/components/sidebar-components/AppSidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import type { Route } from "./+types/layout";
import { getUserLayoutBoards } from "~/utils/user.server";
import { getUserFavoriteBoards } from "~/utils/board.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");

  invariant(userId, "user is not logged in");

  const user = await getUserLayoutBoards(Number(userId));
  invariant(user, "user is not logged in");
  const { Boards, UserBoardRelation } = user;
  const favoriteBoards = await getUserFavoriteBoards(Number(userId));

  const sharedBoards = UserBoardRelation.map((board) => board.board);

  return { sharedBoards, ownedBoards: Boards, favoriteBoards, user };
}

function layout({ loaderData }: Route.ComponentProps) {
  const { ownedBoards, sharedBoards, favoriteBoards, user } = loaderData;

  const boards = ownedBoards.concat(sharedBoards);

  return (
    <SidebarProvider>
      <AppSidebar
        ownedBoards={ownedBoards}
        sharedBoards={sharedBoards}
        favoriteBoards={favoriteBoards}
        user={user}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs boards={boards} />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default layout;
