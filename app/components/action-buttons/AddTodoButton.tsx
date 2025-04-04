import { PlusIcon } from "lucide-react";
import CreateTodoDialog from "../dialogs/CreateTodoDialog";
import { Button } from "../ui/button";

interface AddTodoButtonProps {
  isActive?: boolean;
}

function AddTodoButton({ isActive }: AddTodoButtonProps) {
  return (
    <CreateTodoDialog>
      <Button
        disabled={!isActive}
        variant="ghost"
        className="hover:bg-muted-foreground/20 w-full flex items-center justify-start"
      >
        <PlusIcon />
        <span className="text-start">Add Todo</span>
      </Button>
    </CreateTodoDialog>
  );
}

export default AddTodoButton;
