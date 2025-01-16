import { createContext, PropsWithChildren, useContext } from "react";
import { UserWithBoardRelation } from "~/components/board-components/BoardHeader";

type userContextType = UserWithBoardRelation[];
export const usersContext = createContext<userContextType>([]);

export function usersRelations() {
  const users = useContext(usersContext); // Get users from context

  function getUsersWithRelationToBoard(
    users: UserWithBoardRelation[],
    userId: number,
    boardId: number
  ) {
    const usersWithRelationToBoard = users.filter((user) => {
      user.UserBoardRelation.some((relation) => relation.boardId === boardId) &&
        user.id !== userId;
    });
    return usersWithRelationToBoard;
  }

  function getUsersWithoutRelationToBoard(
    users: UserWithBoardRelation[],
    boardId: number
  ) {
    const usersWithoutRelationToBoard = users.filter(
      (user) =>
        !user.UserBoardRelation.some((relation) => relation.boardId === boardId)
    );

    return usersWithoutRelationToBoard;
  }

  return { users, getUsersWithRelationToBoard, getUsersWithoutRelationToBoard };
}

interface UsersProvider extends PropsWithChildren {
  value: userContextType;
}
export function UsersProvider({ children, value }: UsersProvider) {
  return (
    <usersContext.Provider value={value}>{children}</usersContext.Provider>
  );
}
