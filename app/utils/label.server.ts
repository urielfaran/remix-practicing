import { prisma } from "~/db.server";

export async function createLabel({todoId, backgroundColor}:{todoId: number, backgroundColor?: string}) {
  return await prisma.label.create({
    data: {
      todoId,
      backgroundColor,
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

export async function updateLabel(id: number, backgroundColor: string) {
  return await prisma.label.update({
    where: {
      id,
    },
    data: {
      backgroundColor,
    },
  });
}
