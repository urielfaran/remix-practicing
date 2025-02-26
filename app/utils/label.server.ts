import { prisma } from "~/db.server";

export async function createLabel({
  todoId,
  backgroundColor,
  text,
}: {
  todoId: number;
  backgroundColor?: string;
  text?: string;
}) {
  return await prisma.label.create({
    data: {
      text,
      backgroundColor,
      todo: {
        connect: { id: todoId },
      },
    },
  });
}

export async function deleteLabel(id: number) {
  return await prisma.label.delete({
    where: {
      id,
    },
  });
}

export async function updateLabel({
  labelId,
  todoId,
  backgroundColor,
  text,
}: {
  todoId: number;
  labelId: number;
  backgroundColor?: string | undefined;
  text?: string | undefined;
}) {
  return await prisma.label.update({
    where: {
      id: labelId,
    },
    data: {
      backgroundColor,
      text,
    },
  });
}
