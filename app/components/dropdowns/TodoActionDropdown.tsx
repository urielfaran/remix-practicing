import { Ellipsis } from "lucide-react";
import DeleteButton from "../action-buttons/DeleteButton";
import { Button } from "../ui/button";
import GenericActionDropdown from "./GenericActionDropdown";

interface TodoActionDropdownProps {
  todoId: number;
  todoCompleteTime: boolean;
  isActive?: boolean;
}

function TodoActionDropdown({
  todoId,
  todoCompleteTime,
  isActive = true,
}: TodoActionDropdownProps) {
  return (
    <GenericActionDropdown
      triggerButton={
        <Button variant={"ghost"} size={"icon"} disabled={!isActive}>
          <Ellipsis />
        </Button>
      }
      label="Todo Actions"
    >
      <DeleteButton id={todoId} action="todo" text="Delete Todo" />
    </GenericActionDropdown>
  );
}

export default TodoActionDropdown;
