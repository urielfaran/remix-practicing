import { PlusIcon } from "lucide-react";
import CreateListDialog from "../dialogs/CreateListDialog";
import { Button } from "../ui/button";

interface AddListButtonProps {
  isActive?: boolean;
}
function AddListButton({ isActive = true }: AddListButtonProps) {
  return (
    <CreateListDialog>
      <Button variant="ghost" size={"icon"} disabled={!isActive}>
        <PlusIcon aria-hidden="true" />
      </Button>
    </CreateListDialog>
  );
}

export default AddListButton;
