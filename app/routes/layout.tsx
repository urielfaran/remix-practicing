import { Outlet } from "react-router";
import { ModeToggle } from "~/components/mode-toggle";
import { AppSidebar } from "~/components/sidebar-components/AppSidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { getAllBoards } from "~/utils/board.server";
import type { Route } from "./+types/layout";
import Breadcrumbs from "~/components/Breadcrumbs";
import Logout from "~/components/action-buttons/Logout";

export async function loader() {
  const boards = await getAllBoards();
  return { boards };
}

function layout({ loaderData }: Route.ComponentProps) {
  const { boards } = loaderData;
  return (
    <SidebarProvider>
      <AppSidebar boards={boards} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
            <Logout/>
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
