import { CalendarDays, Clock, ClockAlert, TimerOff } from "lucide-react";
import { Form } from "react-router";
import { useUsersRelations } from "~/hooks/usersContext";
import { getUniqueColors, useBoardStore } from "~/utils/board-store";
import { BoardWithData } from "../board-components/BoardHeader";
import CheckboxFilter from "../filter-components/CheckboxFilter";
import TodoStatusIcon from "../TodoStatusIcon";
import { Badge } from "../ui/badge";
import { statusArray } from "../UpdateTodoStatus";
import UserAvatar from "../user-components/UserAvatar";

const dueTimeFilters = [
  {
    value: "Overdue",
    icon: <Clock className="text-red-500 size-5" />,
  },
  {
    value: "No Duetime",
    icon: <TimerOff className="text-blue-500 size-5" />,
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
  const board = useBoardStore((state) => state.board);
  if (!board) return null;
  const { id } = board;

  const { getUsersWithRelationToBoard, users } = useUsersRelations();

  const usersWithRelationToBoard = getUsersWithRelationToBoard(users, id);

  const uniqueColors = getUniqueColors(board || ({} as BoardWithData));

  return (
    <Form
      method="GET"
      className="flex w-full flex-col space-y-4 p-4"
      onClick={(e) => e.preventDefault()}
    >
      <h2>Due Time</h2>
      {dueTimeFilters.map((filter) => (
        <div className="flex gap-3 items-center" key={filter.value}>
          <CheckboxFilter filterName="Due Time" value={filter.value} />
          {filter.icon} <span>{filter.value}</span>
        </div>
      ))}
      <h2>Status</h2>
      {statusArray.map((status) => (
        <div className="flex gap-4 items-center" key={status}>
          <CheckboxFilter filterName="Status" value={status} />
          <TodoStatusIcon status={status} />
          <span> {status}</span>
        </div>
      ))}
      <h2>Members</h2>
      {usersWithRelationToBoard.map((user, index) => (
        <div key={index} className="flex gap-4">
          <CheckboxFilter filterName="Members" value={user.id} />
          <UserAvatar avatarUrl={user.avatar} username={user.username} />
          {user.username}
        </div>
      ))}
      <h2>Labels</h2>
      {uniqueColors.map((color) => (
        <div key={color} className="flex gap-4">
          <CheckboxFilter filterName="Label" value={color} />
          <Badge
            className="min-h-3 min-w-16 relative group"
            style={{ backgroundColor: color || "grey" }}
          ></Badge>
        </div>
      ))}
    </Form>
  );
}

export default FilterTodosForm;
