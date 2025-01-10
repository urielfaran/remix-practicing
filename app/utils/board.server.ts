import { Board, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { combinePermissions, Permissions } from "./permissions";

export async function getAllBoards() {
  return prisma.board.findMany({});
}

export async function getBoard(boardId: number) {
  return prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      lists: {
        include: {
          todos: true,
        },
      },
    },
  });
}

export async function getFilterBoards(userId: number, query?: string) {
  return prisma.board.findMany({
    where: {
      name: query ? { contains: query } : undefined, // Filters only if query exists
      UserBoardRelation: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      lists: true,
      UserBoardRelation: {
        select: {
          isFavorite: true,
        },
      },
    },
  });
}

export async function createBoard({
  name,
  backgroundColor,
  creatingUserid,
}: Prisma.BoardCreateWithoutCreatingUserInput & { creatingUserid: number }) {
  return prisma.board.create({
    data: {
      name: name,
      creatingUserid: creatingUserid,
      backgroundColor: backgroundColor,
      UserBoardRelation: {
        create: {
          userId: creatingUserid,
          permissions: combinePermissions(
            Permissions.WRITE,
            Permissions.DELETE
          ),
        },
      },
    },
  });
}

export async function deleteBoard(id: number) {
  return prisma.board.delete({
    where: {
      id: id,
    },
  });
}

export async function favoriteBoard(
  boardId: number,
  favoriteStatus: boolean,
  userId: number
) {
  return prisma.userBoardRelation.update({
    where: {
      boardId_userId: {
        boardId: boardId,
        userId: userId,
      },
    },
    data: {
      isFavorite: !favoriteStatus,
    },
  });
}

export async function updateBoard({
  id,
  ...data
}: Prisma.BoardUpdateInput & {
  id: Board["id"];
}) {
  return prisma.board.update({
    where: { id: id },
    data: data,
  });
}

export async function getUserFavoriteBoards(userId: number) {
  return await prisma.board.findMany({
    where: {
      UserBoardRelation: {
        some: {
          userId: userId,
          isFavorite: true,
        },
      },
    },
    include: {
      UserBoardRelation: {
        where: {
          userId: userId,
        },
        select: {
          isFavorite: true,
          permissions: true,
        },
      },
    },
  });
}

export async function getUserBoardRelation(userId: number, boardId: number) {
  return await prisma.userBoardRelation.findUnique({
    where: {
      boardId_userId: {
        boardId: boardId,
        userId: userId,
      },
    },
  });
}

export async function addUserPermission(
  userId: number,
  boardId: number,
  permission: number
) {
  return await prisma.userBoardRelation.create({
    data: {
      boardId: boardId,
      userId: userId,
      permissions: permission,
    },
  });
}

export async function deleteUserPermission(userId: number, boardId: number) {
  return await prisma.userBoardRelation.delete({
    where: {
      boardId_userId: {
        boardId: boardId,
        userId: userId,
      },
    },
  });
}

export async function updateUserPermission(
  userId: number,
  boardId: number,
  permission: number
) {
  return await prisma.userBoardRelation.update({
    where: {
      boardId_userId: {
        boardId: boardId,
        userId: userId,
      },
    },
    data: {
      permissions: permission,
    },
  });
}
