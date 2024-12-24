import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import CompleteTodoButton from "../action-buttons/CompleteTodoButton";
import DeleteButton from "../action-buttons/DeleteButton";
import EditTodoButton from "../action-buttons/EditTodoButton";

interface TodoActionDropdownProps extends PropsWithChildren {
  todoId: number;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function TodoActionDropdown({
  children,
  todoId,
  isEditing,
  setIsEditing,
}: TodoActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuLabel>Todo Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-2">
          <DeleteButton
            id={todoId}
            action={'"delete-todo"'}
            text={"Delete Todo"}
          />
          <CompleteTodoButton id={todoId} />
          <EditTodoButton isEditing={isEditing} setIsEditing={setIsEditing} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TodoActionDropdown;
