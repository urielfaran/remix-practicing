import { Calendar, List, Table2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function SelectDataView() {
  const { id, name, data } = useParams();
  const navigate = useNavigate();
  const { type } =
    dataViewOptions.find((option) => option.url === data) || dataViewOptions[0];

  const handleValueChange = (url: string) => {
    const navTo = `/board/${id}/${name}/${url}`;
    navigate(navTo);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={type ?? "Select data view"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dataViewOptions.map(({ icon: Icon, type, url }) => (
            <SelectItem key={type} value={url}>
              <div className="flex flex-row items-center gap-2">
                <Icon className="size-4" />
                <span>{type}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SelectDataView;

export const dataViewOptions = [
  {
    type: "list",
    url: " ",
    icon: List,
  },
  {
    type: "calendar",
    url: "calendar",
    icon: Calendar,
  },
];
