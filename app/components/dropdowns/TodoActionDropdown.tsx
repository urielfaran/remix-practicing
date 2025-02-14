import { Ellipsis, Tag } from "lucide-react";
import DeleteButton from "../action-buttons/DeleteButton";
import { Button } from "../ui/button";
import GenericActionDropdown from "./GenericActionDropdown";
import AddLabelPopover from "../AddLabelPopover";

interface TodoActionDropdownProps {
  todoId: number;
  isActive?: boolean;
}

function TodoActionDropdown({
  todoId,
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
      <AddLabelPopover todoId={todoId}>
        <Button
          type="submit"
          variant={"ghost"}
          size={"sm"}
          className={
            "relative flex justify-between w-full group select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
          }
        >
          <span>Add Label</span>
          <Tag className="group-hover:text-blue-500" />
        </Button>
      </AddLabelPopover>
    </GenericActionDropdown>
  );
}

export default TodoActionDropdown;
