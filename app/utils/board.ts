import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAllBoards() {
  return prisma.board.findMany({
    include: {
      lists: true,
    },
  });
}

export async function createBoard({ name }: Prisma.BoardCreateInput) {
  return prisma.board.create({
    data: {
      name: name,
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
