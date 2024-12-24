import { PlusIcon } from "lucide-react";
import CreateListDialog from "../dialogs/CreateListDialog";
import { Button } from "../ui/button";

function AddListButton() {
  return (
    <CreateListDialog>
      <Button variant="ghost" size={"icon"}>
        <PlusIcon aria-hidden="true" />
      </Button>
    </CreateListDialog>
  );
}

export default AddListButton;
