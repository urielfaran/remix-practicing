import { Prisma, Todo } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createTodo({
  title,
  description,
  dueTime,
  listId,
  status,
  order,
}: Prisma.TodoCreateWithoutListInput & {
  listId: Todo["listId"];
}) {
  return prisma.todo.create({
    data: {
      title: title,
      description: description,
      dueTime: dueTime,
      status: status,
      listId: listId,
      order,
    },
  });
}

export async function updateTodo({
  id,
  description,
  dueTime,
  title,
}: Prisma.TodoUpdateInput & {
  id: Todo["id"];
}) {
  return prisma.todo.update({
    where: { id: id },
    data: {
      title: title,
      description: description,
      dueTime: dueTime,
    },
  });
}

export async function deleteTodo(id: number) {
  return prisma.todo.delete({ where: { id: id } });
}


export async function updateTodoStatus({
  status,
  id,
}: Prisma.TodoUpdateInput & { id: number }) {
  const completeTime = status === "COMPLETED" ? new Date() : null;
  return await prisma.todo.update({
    where: { id: id },
    data: {
      status: status,
      completeTime: completeTime,
    },
  });
}

export async function assignTodo({
  userId,
  todoId,
}: {
  userId: number;
  todoId: number;
}) {
  return await prisma.todo.update({
    where: { id: todoId },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function unassignTodo({
  userId,
  todoId,
}: {
  userId: number;
  todoId: number;
}) {
  return await prisma.todo.update({
    where: { id: todoId },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
}

export async function getTodoTitleById(todoId: number) {
  return await prisma.todo.findUnique({
    where: { id: todoId },
    select: {
      title: true,
    },
  });
}

export async function changeTodoList({
  id,
  listId: newListId,
  order
}: Pick<Prisma.TodoUncheckedCreateInput, "id" | "listId" | "order">) {
  return await prisma.todo.update({
    where: {
      id: id,
    },
    data: {
      List: {
        connect: {
          id: newListId,
        },
      },
      order
    },
  });
}

export async function getLastOrder(listId: number) {
  const lastOrder = await prisma.todo.findFirst({
    where: {
      listId: listId,
    },
    orderBy: {
      order: "desc",
    },
    select: {
      order: true,
    },
  });

  const newOrder = lastOrder ? lastOrder.order + 1 : 1;
  return newOrder;
}
