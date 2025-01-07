import { Ellipsis } from "lucide-react";
import DeleteButton from "../action-buttons/DeleteButton";
import { Button } from "../ui/button";
import GenericActionDropdown from "./GenericActionDropdown";

interface ListActionDropdownProps {
  listId: number;
  isActive? : boolean
}

function ListActionDropdown({ listId, isActive }: ListActionDropdownProps) {
  return (
    <GenericActionDropdown
      triggerButton={
        <Button variant={"ghost"} size={"icon"} disabled={!isActive}>
          <Ellipsis />
        </Button>
      }
      label="List Actions"
    >
      <DeleteButton id={listId} action="list" text="Delete List" />
    </GenericActionDropdown>
  );
}

export default ListActionDropdown;
