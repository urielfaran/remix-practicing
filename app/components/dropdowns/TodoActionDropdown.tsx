import { Ellipsis } from "lucide-react";
import CompleteTodoButton from "../action-buttons/CompleteTodoButton";
import DeleteButton from "../action-buttons/DeleteButton";
import EditTodoButton from "../action-buttons/EditTodoButton";
import { Button } from "../ui/button";
import GenericActionDropdown from "./GenericActionDropdown";

interface TodoActionDropdownProps {
  todoId: number;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function TodoActionDropdown({
  todoId,
  isEditing,
  setIsEditing,
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
      <DeleteButton id={todoId} action='"delete-todo"' text="Delete Todo" />
      <CompleteTodoButton id={todoId} />
      <EditTodoButton isEditing={isEditing} setIsEditing={setIsEditing} />
    </GenericActionDropdown>
  );
}

export default TodoActionDropdown;
