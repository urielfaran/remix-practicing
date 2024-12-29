import { House } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

export function HomeHeader() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <House className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{"Home"}</span>
        <span className="truncate text-xs">{"All boards"}</span>
      </div>
    </SidebarMenuButton>
  );
}