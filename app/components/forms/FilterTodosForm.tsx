import { Form } from "react-router";
import { Checkbox } from "../ui/checkbox";
import {
  CalendarDays,
  Circle,
  CircleCheckBig,
  CircleEllipsis,
  Clock,
  ClockAlert,
  LoaderCircle,
} from "lucide-react";
import { UserWithBoardRelation } from "../board-components/BoardHeader";
import UserAvatar from "../user-components/UserAvatar";

interface FilterTodosFormProps {
  users: UserWithBoardRelation[];
}

function FilterTodosForm({ users }: FilterTodosFormProps) {
  return (
    <>
      <Form method="GET" className="flex w-full flex-col space-y-4 p-4">
        <h2>Due Time</h2>
        <div className="flex gap-3 items-center">
          <Checkbox type="submit" name="filter" value={"Due Time:Overdue"} />
          <Clock className="text-red-500 size-5" /> Overdue
        </div>
        <div className="flex gap-3 items-center">
          <Checkbox type="submit" name="filter" value={"Due Time:Tommorow"} />
          <ClockAlert className="text-orange-400 size-5" /> Tommorow
        </div>
        <div className="flex gap-3 items-center">
          <Checkbox type="submit" name="filter" value={"Due Time:Week"} />
          <CalendarDays className="size-5" /> This Week
        </div>

        <h2>Status</h2>
        <div className="flex gap-3 items-center">
          <Checkbox type="submit" name="filter" value={"Status:NOT_STARTED"} />
          <CircleEllipsis className="size-5" /> Not started
        </div>
        <div className="flex gap-3 items-center">
          <Checkbox type="submit" name="filter" value={"Status:IN_PROGGRESS"} />
          <LoaderCircle className="size-5 text-blue-500" /> In proggress
        </div>
        <div className="flex gap-3 items-center">
          <Checkbox type="submit" name="filter" value={"Status:COMPLETED"} />
          <CircleCheckBig className="text-green-400 size-5" /> Completed
        </div>
        <h2>Members</h2>
        {users?.map((user, index) => (
          <div key={index} className="flex gap-2">
            <Checkbox
              type="submit"
              name="filter"
              value={`Members:${user.id}`}
            />
            <UserAvatar avatarUrl={user.avatar} username={user.username} />
            {user.username}
          </div>
        ))}
      </Form>
    </>
  );
}

export default FilterTodosForm;
