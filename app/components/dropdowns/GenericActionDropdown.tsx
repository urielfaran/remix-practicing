import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";

interface DropdownActionProps extends PropsWithChildren{
  actions: React.ReactNode[]; 
  label: string;
}

function GenericActionDropdown({ children, actions, label }: DropdownActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">
          {actions.map((ActionComponent, index) => (
            <div key={index}>{ActionComponent}</div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GenericActionDropdown