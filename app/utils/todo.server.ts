import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAllToDos({
  query,
  startDate,
  endDate,
}: {
  query: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}) {
  return prisma.todo.findMany({
    where: {
      dueTime: { lte: endDate, gte: startDate },
      isCompleted: false,
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
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

export async function createTodo({
  title,
  description,
  dueTime,
  listId
}: Prisma.TodoCreateWithoutListInput & { listId: number }) {
  return prisma.todo.create({
    data: {
      title: title,
      description: description,
      dueTime: dueTime,
      // isCompleted: false,
      listId: listId
    },
  });
}

export async function updateTodo({
  title,
  description,
  dueTime,
  id,
}: Prisma.TodoUpdateInput & { id: number }) {
  return prisma.todo.update({
    where: { id: id },
    data: { title: title, description: description, dueTime: dueTime },
  });
}

export async function deleteTodo(id: number) {
  return prisma.todo.delete({ where: { id: id } });
}

export async function completeTodo(id: number) {
  return prisma.todo.update({ where: { id: id }, data: { isCompleted: true } });
}