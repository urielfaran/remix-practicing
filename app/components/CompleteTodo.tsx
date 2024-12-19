import { Check } from "lucide-react";
import DeleteDialog from "./DeleteDialog";
import { Button } from "./ui/button";

interface CompleteTodoProps {
  id: number;
}
function CompleteTodo({ id }: CompleteTodoProps) {
  return (
    <>
      <DeleteDialog text={"This action will complete the todo"} id={id}>
        <Button size={"icon"} className="bg-green-500 hover:bg-green-400">
          <Check />
        </Button>
      </DeleteDialog>
    </>
  );
}

export default CompleteTodo;
