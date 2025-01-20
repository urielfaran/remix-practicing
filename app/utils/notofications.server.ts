import { prisma } from "~/db.server";

export async function createNotification(
  sendingUserId: number,
  recievingUserId: number,
  message: string
) {
  return await prisma.notification.create({
    data: {
      sendingUserId: sendingUserId,
      userId: recievingUserId,
      message,
    },
  });
}

export async function getNotifications(userId: number) {
  return await prisma.notification.findMany({
    where: {
      userId: userId,
    },
  });
}

export async function setNotificationsStatus(userId: number) {
  return await prisma.notification.updateMany({
    where: {
      userId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}
