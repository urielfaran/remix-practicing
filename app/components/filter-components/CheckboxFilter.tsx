import { useSearchParams } from "react-router";
import { Checkbox } from "../ui/checkbox";

interface CheckboxFilterProps {
  value: any;
  filterName: string;
}

function CheckboxFilter({ value, filterName }: CheckboxFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isChecked = searchParams
    .getAll("filter")
    .includes(`${filterName}:${value}`);

  const handleCheckboxChange = (checked: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    const filterValue = `${filterName}:${value}`;

    if (checked) {
      newParams.append("filter", filterValue);
    } else {
      newParams.delete("filter", filterValue);
    }

    setSearchParams(newParams);
  };

  return (
    <Checkbox
      name="filter"
      value={`${filterName}:${value}`}
      checked={isChecked}
      onCheckedChange={(checked) => handleCheckboxChange(checked as boolean)}
    />
  );
}

export default CheckboxFilter;
