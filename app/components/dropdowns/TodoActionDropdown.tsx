import { Ellipsis } from "lucide-react";
import CompleteTodoButton from "../action-buttons/CompleteTodoButton";
import DeleteButton from "../action-buttons/DeleteButton";
import { Button } from "../ui/button";
import GenericActionDropdown from "./GenericActionDropdown";

interface TodoActionDropdownProps {
  todoId: number;
  todoCompleteTime: boolean;
}

function TodoActionDropdown({
  todoId,
  todoCompleteTime
}: TodoActionDropdownProps) {
  return (
    <GenericActionDropdown
      triggerButton={
        <Button variant={"ghost"} size={"icon"}>
          <Ellipsis />
        </Button>
      }
      label="Todo Actions"
    >
      <DeleteButton id={todoId} action="todo" text="Delete Todo" />
      <CompleteTodoButton id={todoId} todoCompleteTime= {todoCompleteTime}/>
    </GenericActionDropdown>
  );
}

export default TodoActionDropdown;
