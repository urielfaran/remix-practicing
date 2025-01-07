import { Ellipsis } from "lucide-react";
import DeleteButton from "../action-buttons/DeleteButton";
import GenericCompleteButton from "../action-buttons/GenericCompleteButton";
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
      <GenericCompleteButton
        todoCompleteTime={todoCompleteTime}
        todoId={todoId}
        className="relative flex justify-between w-full group select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
      />
    </GenericActionDropdown>
  );
}

export default TodoActionDropdown;
