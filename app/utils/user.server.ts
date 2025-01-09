import { prisma } from "~/db.server";

export async function getUserById(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserBoardRelation: true,
    },
  });
}

export async function getUserWithBoardById(userId: number, boardId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserBoardRelation: {
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
              UserBoardRelation: true
            },
          },
        },
      },
    },
  });
}

export async function getActiveUsers() {
  return await prisma.user.findMany({
    where: {
      isDisabled: false,
    },
    include:{
      UserBoardRelation:true
    },
    take: 10,
  });
}

export async function getUserLayoutBoards(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Boards: {
        include:{
          UserBoardRelation:true
        }
      },
      UserBoardRelation: {
        where: {
          board: {
            creatingUserid: {
              not: userId,
            },
          },
        },
        select: {
          board: true,
          isFavorite: true
        },
      },
    },
  });
}

export async function getUserFavoriteBoards(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
      UserBoardRelation: {
        some: {
          isFavorite: true,
        },
      },
    },
    include: {
      Boards:{}
    }
  });
}
