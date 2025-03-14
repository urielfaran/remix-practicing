import { PlusIcon } from "lucide-react";
import { Permissions, usePermissionStore } from "~/utils/permissions";
import CreateListDialog from "../dialogs/CreateListDialog";
import { Button } from "../ui/button";

function AddListButton() {
  const isEditPermission = usePermissionStore((state) =>
    state.hasPermission(Permissions.WRITE)
  );
  return (
    <CreateListDialog>
      <Button variant="ghost" disabled={!isEditPermission}>
        <div className="flex flex-row gap-2 items-center">
          <PlusIcon
            aria-hidden="true"
            className="text-muted-foreground"
          />
          <p className="text-muted-foreground">Add List</p>
        </div>
      </Button>
    </CreateListDialog>
  );
}

export default AddListButton;
