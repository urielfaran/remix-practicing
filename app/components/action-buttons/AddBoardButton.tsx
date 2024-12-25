import CreateBoardDialog from "../dialogs/CreateBoardDialog";
import { Button } from "../ui/button";

function AddBoardButton() {
  return (
    <CreateBoardDialog>
      <Button variant="default" className="bg-muted-foreground min-w-72 min-h-28">
        <span>Create New Board</span>
      </Button>
    </CreateBoardDialog>
  );
}

export default AddBoardButton;
