import { Bell } from "lucide-react";
import { Outlet, useFetcher } from "react-router";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import Breadcrumbs from "~/components/Breadcrumbs";
import { ModeToggle } from "~/components/mode-toggle";
import NotificationsPopover from "~/components/NotificationsPopover";
import { AppSidebar } from "~/components/sidebar-components/AppSidebar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { getUserFavoriteBoards } from "~/utils/board.server";
import { getNotificationsLength } from "~/utils/notofications.server";
import { getUserLayoutBoards } from "~/utils/user.server";
import type { Route } from "./+types/layout";
import { UserIdContext } from "~/hooks/itemIdContexts";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");

  invariant(userId, "user is not logged in");

  const user = await getUserLayoutBoards(Number(userId));
  invariant(user, "user is not logged in");
  const { Boards, UserBoardRelation } = user;
  const favoriteBoards = await getUserFavoriteBoards(Number(userId));

  const sharedBoards = UserBoardRelation.map((board) => board.board);

  const notificationsLength = await getNotificationsLength(Number(userId));

  return {
    sharedBoards,
    ownedBoards: Boards,
    favoriteBoards,
    user,
    notificationsLength,
  };
}

function layout({ loaderData }: Route.ComponentProps) {
  const {
    ownedBoards,
    sharedBoards,
    favoriteBoards,
    user,
    notificationsLength,
  } = loaderData;

  const boards = ownedBoards.concat(sharedBoards);
  const fetcher = useFetcher();
  return (
    <SidebarProvider>
      <UserIdContext.Provider value={user.id}>
        <AppSidebar
          ownedBoards={ownedBoards}
          sharedBoards={sharedBoards}
          favoriteBoards={favoriteBoards}
          user={user}
        />
      </UserIdContext.Provider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs boards={boards} />
          </div>
          <div className="flex ml-auto items-center justify-end gap-4 mx-4">
            <NotificationsPopover>
              <Button size={"icon"} variant={"ghost"}>
                <Bell
                  className={cn("text-blue-500", {
                    "text-red-500": notificationsLength > 0,
                  })}
                />
                {notificationsLength > 0 ? notificationsLength : null}
              </Button>
            </NotificationsPopover>
            {/* <fetcher.Form action="/action/notifications-test" method="POST">
              <Button type="submit">reset</Button>
            </fetcher.Form> */}
            <ModeToggle />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default layout;
