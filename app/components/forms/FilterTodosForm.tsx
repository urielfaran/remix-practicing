import { CalendarDays, Clock, ClockAlert } from "lucide-react";
import { useContext } from "react";
import { Form, useSearchParams } from "react-router";
import { BoardIdContext } from "~/hooks/itemIdContexts";
import { usersRelations } from "~/hooks/usersContext";
import TodoStatusIcon from "../TodoStatusIcon";
import { Checkbox } from "../ui/checkbox";
import { statusArray } from "../UpdateTodoStatus";
import UserAvatar from "../user-components/UserAvatar";

const dueTimeFilters = [
  {
    value: "Overdue",
    icon: <Clock className="text-red-500 size-5" />,
  },
  {
    value: "Tommorow",
    icon: <ClockAlert className="text-orange-400 size-5" />,
  },
  {
    value: "Week",
    icon: <CalendarDays className="size-5" />,
  },
];

function FilterTodosForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamArr = searchParams.getAll("filter");

  const boardId = useContext(BoardIdContext);

  const { getUsersWithRelationToBoard, users } = usersRelations();

  const usersWithRelationToBoard = getUsersWithRelationToBoard(users, boardId);

  const isChecked = (value: string) => {
    return searchParamArr.includes(value);
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newParams = new URLSearchParams(searchParams);

    if (checked) {
      newParams.append("filter", value);
    } else {
      newParams.delete("filter", value);
    }

    setSearchParams(newParams);
  };

  return (
    <Form
      method="GET"
      className="flex w-full flex-col space-y-4 p-4"
      onClick={(e) => e.preventDefault()}
    >
      <h2>Due Time</h2>
      {dueTimeFilters.map((filter) => (
        <div className="flex gap-3 items-center" key={filter.value}>
          <Checkbox
            name="filter"
            value={`Due Time:${filter.value}`}
            checked={isChecked(`Due Time:${filter.value}`)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(
                `Due Time:${filter.value}`,
                checked as boolean
              )
            }
          />
          {filter.icon} <span>{filter.value}</span>
        </div>
      ))}
      <h2>Status</h2>
      {statusArray.map((status) => (
        <div className="flex gap-3 items-center" key={status}>
          <Checkbox
            name="filter"
            value={`Status:${status}`}
            checked={isChecked(`Status:${status}`)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(`Status:${status}`, checked as boolean)
            }
          />
          <TodoStatusIcon status={status} />
          <span> {status}</span>
        </div>
      ))}
      <h2>Members</h2>
      {usersWithRelationToBoard.map((user, index) => (
        <div key={index} className="flex gap-2">
          <Checkbox
            name="filter"
            value={`Members:${user.id}`}
            checked={isChecked(`Members:${user.id}`)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(`Members:${user.id}`, checked as boolean)
            }
          />
          <UserAvatar avatarUrl={user.avatar} username={user.username} />
          {user.username}
        </div>
      ))}
    </Form>
  );
}

export default FilterTodosForm;
