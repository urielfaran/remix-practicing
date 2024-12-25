import { Ellipsis } from "lucide-react";
import DeleteButton from "../action-buttons/DeleteButton";
import { Button } from "../ui/button";
import GenericActionDropdown from "./GenericActionDropdown";

interface BoardActionDropdownProps {
  boardId: number;
}

function BoardActionDropdown({ boardId }: BoardActionDropdownProps) {
  return (
    <GenericActionDropdown
      triggerButton={
        <Button variant={"ghost"} size={"icon"}>
          <Ellipsis />
        </Button>
      }
      label="Board Actions"
    >
      <DeleteButton id={boardId} action='"delete-board"' text="Delete board" />
    </GenericActionDropdown>
  );
}

export default BoardActionDropdown;
