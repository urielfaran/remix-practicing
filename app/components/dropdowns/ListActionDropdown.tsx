import { Ellipsis } from "lucide-react";
import DeleteButton from "../action-buttons/DeleteButton";
import { Button } from "../ui/button";
import GenericActionDropdown from "./GenericActionDropdown";

interface ListActionDropdownProps {
  listId: number;
}

function ListActionDropdown({ listId }: ListActionDropdownProps) {
  return (
    <GenericActionDropdown
      triggerButton={
        <Button variant={"ghost"} size={"icon"}>
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
