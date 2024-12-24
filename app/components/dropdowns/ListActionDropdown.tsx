import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import DeleteButton from "../action-buttons/DeleteButton";
interface ListActionDropdownProps extends PropsWithChildren {
  listId: number;
}

function ListActionDropdown({ children, listId }: ListActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuLabel>List Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">
          <DeleteButton
            id={listId}
            action={'"delete-list"'}
            text={"Delete List"}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ListActionDropdown;
