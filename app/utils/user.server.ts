import { prisma } from "~/db.server";

export async function getUserById(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserBoardPermission: true,
    },
  });
}
export async function getUserWithBoardById(userId: number, boardId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserBoardPermission: {
        where: {
          boardId: boardId,
          userId: userId,
        },
        include: {
          board: {
            include: {
              lists: {
                include: {
                  todos: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getAllUsersWithoutPermission(boardId: number) {
  return await prisma.user.findMany({
    where: {
      isDisabled: false,
      UserBoardPermission: {
        every: {
          NOT: {
            boardId: boardId,
          },
        },
      },
    },
  });
}
