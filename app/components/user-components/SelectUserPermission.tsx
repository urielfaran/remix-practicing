import { permissionsArray } from "~/schemas/shareBoard.schema";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function SelectUserPermission() {
  return (
    <>
      <SelectTrigger className="min-w-32">
        <SelectValue placeholder="Select permission" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {permissionsArray.map((permission, index) => (
            <SelectItem key={index} value={permission.value}>
              {permission.key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </>
  );
}

export default SelectUserPermission;
