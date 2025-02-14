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
      <Button
        variant="ghost"
        size={"icon"}
        disabled={!isEditPermission}
      >
        <PlusIcon aria-hidden="true" />
      </Button>
    </CreateListDialog>
  );
}

export default AddListButton;
