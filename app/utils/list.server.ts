import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAllLists(boardId: number) {
  return prisma.list.findMany({
    include: {
      todos: true,
    },
    where: {
      boardId: boardId,
    },
  });
}

export async function getAllOnTimeToDos() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return prisma.todo.findMany({
    where: {
      dueTime: {
        gte: startOfToday,
      },
    },
  });
}

export async function createList({
  title,
  boardId
}: Prisma.ListCreateInput & { boardId: number }) {
  return prisma.list.create({
    data: {
      title: title,
      boardId: boardId,
    },
  });
}

export async function updateList({
  title,
  id,
}: Prisma.ListUpdateInput & { id: number }) {
  return prisma.list.update({
    where: { id: id },
    data: { title: title },
  });
}

export async function deleteList(id: number) {
  return prisma.list.delete({ where: { id: id } });
}
