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
import { prisma } from "~/db.server";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      Boards: {},
      UserBoardPermission: {
        where: {
          board: {
            creatingUserid: {
              not: Number(userId),
            },
          },
        },
        select: {
          board: true,
        },
      },
    },
  });
  invariant(user, "user is not logged in");
  const { Boards, UserBoardPermission } = user;

  const sharedBoards = UserBoardPermission.map((board) => board.board);
  return { sharedBoards, ownedBoards: Boards };
}

function layout({ loaderData }: Route.ComponentProps) {
  const { ownedBoards, sharedBoards } = loaderData;

  const boards = ownedBoards.concat(sharedBoards)

  return (
    <SidebarProvider>
      <AppSidebar ownedBoards={ownedBoards} sharedBoards={sharedBoards} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            <Logout />
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
