import { Check } from "lucide-react";
import CompleteDialog from "../dialogs/CompleteDialog";
import { Button } from "../ui/button";

interface CompleteTodoProps {
  id: number;
}
function CompleteTodoButton({ id }: CompleteTodoProps) {
  return (
    <>
      <CompleteDialog text={"This action will complete the todo"} id={id}>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="relative flex justify-between w-full group select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
        >
          <span>Complete Todo</span>
          <Check className="group-hover:text-green-400" />
        </Button>
      </CompleteDialog>
    </>
  );
}

export default CompleteTodoButton;
