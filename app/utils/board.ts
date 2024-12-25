import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createBoard({ name }: Prisma.BoardCreateInput) {
  return prisma.board.create({
    data: {
      name: name,
    },
  });
}

export async function deleteBoard({ id }: { id: number }) {
  return prisma.board.delete({
    where: {
      id: id,
    },
  });
}

// export async function updateBoard({ name }: Prisma.BoardCreateInput) {
//   return prisma.board.create({
//     data: {
//       name: name,
//     },
//   });
// }
