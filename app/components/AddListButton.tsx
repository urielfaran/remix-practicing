import { PlusIcon } from "lucide-react";
import CreateList from "./CreateList";
import { Button } from "./ui/button";

function AddListButton() {
  return (
    <div className="max-w-40 p-4 ">
      <CreateList>
        <Button variant="ghost" asChild size={"icon"}>
          <PlusIcon className="w-5 h-5" aria-hidden="true" />
        </Button>
      </CreateList>
    </div>
  );
}

export default AddListButton;
