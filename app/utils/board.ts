import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAllBoards() {
  return prisma.board.findMany({});
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

export async function updateBoard({
  name,
  id,
  backgroundColor,
}: {
  name?: string;
  backgroundColor?: string | null;
  id: number;
}) {
  return prisma.board.update({
    where: { id: id },
    data: {
      name: name,
      backgroundColor: backgroundColor,
    },
  });
}
