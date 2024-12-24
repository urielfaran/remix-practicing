import React from "react";
import { Button } from "../ui/button";
import { FilePenLine } from "lucide-react";

interface EditTodoProps {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditTodoButton({ isEditing, setIsEditing }: EditTodoProps) {
  return (
    <Button
      className="relative flex justify-between w-full group select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
      size={"sm"}
      onClick={() => setIsEditing(!isEditing)}
      variant={"ghost"}
    >
      <span>Edit Todo</span>
      <FilePenLine className="group-hover:text-blue-600" />
    </Button>
  );
}

export default EditTodoButton;
