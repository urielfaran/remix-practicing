import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";

interface DropdownActionProps extends PropsWithChildren {
  triggerButton: React.ReactNode;
  label: string;
}

function GenericActionDropdown({
  children,
  triggerButton,
  label,
}: DropdownActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-inherit" asChild>
        {triggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GenericActionDropdown;
