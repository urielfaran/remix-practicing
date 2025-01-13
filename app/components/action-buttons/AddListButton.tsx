import { PlusIcon } from "lucide-react";
import CreateListDialog from "../dialogs/CreateListDialog";
import { Button } from "../ui/button";
import { usePermission } from "~/hooks/permissionsContext";
import { Permissions } from "~/utils/permissions";

function AddListButton() {
  const { checkPermission } = usePermission();
  const isEditPermission = checkPermission(Permissions.WRITE);

  return (
    <CreateListDialog>
      <Button variant="ghost" size={"icon"} disabled={!isEditPermission}>
        <PlusIcon aria-hidden="true" />
      </Button>
    </CreateListDialog>
  );
}

export default AddListButton;
