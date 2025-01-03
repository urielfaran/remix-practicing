import { Board, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

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

export async function getFilterBoards(query: string) {
  return prisma.board.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    include: {
      lists: true,
    },
  });
}

export async function createBoard({
  name,
  backgroundColor,
}: Prisma.BoardCreateInput) {
  return prisma.board.create({
    data: {
      name: name,
      backgroundColor: backgroundColor,
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

export async function favoriteBoard(id: number, favoriteStatus: boolean) {
  return prisma.board.update({
    where: {
      id: id,
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
