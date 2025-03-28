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
      <SelectTrigger className="min-w-40">
        <SelectValue placeholder="Select permission" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {permissionsArray.map((permission, index) => (
            <SelectItem
              className="capitalize"
              key={index}
              value={permission.value}
            >
              <span               className="capitalize"
              >{permission.key}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </>
  );
}

export default SelectUserPermission;
