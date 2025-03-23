import { Prisma } from "@prisma/client";
import { ConncetedUsersContext } from "~/hooks/conncetedUsersContext";
import AddListButton from "../action-buttons/AddListButton";
import DisplayList from "../display-data/DisplayList";
import { FullBoard } from "~/routes/board";

interface ListsProps {
  board: FullBoard;
}

function Lists({ board }: ListsProps) {
  const connectedusers = board.UserBoardRelation.map(
    (relation) => relation.user
  );
  return (
    <div className="flex flex-row gap-9 min-w-0 overflow-x-auto p-4">
      <AddListButton />
      <ConncetedUsersContext.Provider value={connectedusers}>
        {board.lists.map((list) => (
          <DisplayList key={list.id} list={list} />
        ))}
      </ConncetedUsersContext.Provider>
    </div>
  );
}

export default Lists;
