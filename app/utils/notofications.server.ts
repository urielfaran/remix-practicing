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

export async function getNotifications(userId: number, page: number) {
  return await prisma.notification.findMany({
    where: {
      userId: userId,
      isRead: false,
    },
    skip: 5 * page,
    take: 5,
  });
}

export async function getNotificationsLength(userId: number) {
  return await prisma.notification.count({
    where: {
      userId: userId,
      isRead: false,
    },
  });
}

export async function setNotificationsStatus(userId: number, page: number, notificationIds: number[]) {
  console.log(notificationIds)
  return await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
    },
    data: {
      isRead: true,
    },
  });
}
