import { prisma } from "~/db.server";

export async function getUserById(userId: number) {
  return await prisma.user.findUnique({ where: { id: userId } });
}
