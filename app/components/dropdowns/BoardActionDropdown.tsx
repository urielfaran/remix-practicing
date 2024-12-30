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
        <Button variant={"ghost"} size={"icon"} className="hover: bg-inherit">
          <Ellipsis className="hover:-scale-150 transition-transform duration-150" />
        </Button>
      }
      label="Board Actions"
    >
      <DeleteButton id={boardId} action='"delete-board"' text="Delete board" />
    </GenericActionDropdown>
  );
}

export default BoardActionDropdown;
