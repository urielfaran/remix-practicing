import { Prisma } from "@prisma/client";
import { createContext } from "react";

export type UserWithTodo = Prisma.UserGetPayload<{
  include: {
    Todos: true;
  };
}>;
export const ConncetedUsersContext = createContext<UserWithTodo[]>([]);
