import { Prisma, Status } from "@prisma/client";
import { statusArray } from "~/components/UpdateTodoStatus";
import { prisma } from "~/db.server";

export async function getUserById(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserBoardRelation: true,
    },
  });
}

export async function getUserWithBoardById(
  userId: number,
  boardId: number,
  filter: { [x: string]: string[] }
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const oneWeekForward = new Date();
  oneWeekForward.setDate(today.getDate() + 7); // 7 days from today
  oneWeekForward.setHours(23, 59, 59, 999); // End of the last day for comparison

  const userFilter: Prisma.TodoWhereInput["users"] = filter["Members"]
    ? {
        some: {
          id: { in: filter["Members"].map(Number) }, // Cast to number[]
        },
      }
    : {};

  const statusFilter: Prisma.TodoWhereInput["status"] = filter["Status"]
    ? {
        in: filter["Status"].filter((status) =>
          statusArray.includes(status as keyof typeof Status)
        ) as Status[],
      }
    : {};

  const dueTimeFilter: Prisma.TodoWhereInput["dueTime"] = filter["Due Time"]
    ? filter["Due Time"]?.includes("Overdue")
      ? {
          lt: today,
        }
      : filter["Due Time"]?.includes("No Duetime")
      ? {
          equals: null,
        }
      : filter["Due Time"]?.includes("Tommorow")
      ? {
          gte: today,
          lte: tomorrow,
        }
      : filter["Due Time"]?.includes("Week")
      ? {
          gte: today,
          lte: oneWeekForward,
        }
      : {}
    : {};

  const labelsFilter: Prisma.TodoWhereInput["labels"] = filter["Label"]
    ? {
        some: {
          backgroundColor: {
            in: filter["Label"],
          },
        },
      }
    : {};

  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      UserBoardRelation: {
        where: {
          boardId: boardId,
          userId: userId,
        },
        include: {
          board: {
            include: {
              lists: {
                include: {
                  todos: {
                    where: {
                      AND: [
                        { users: userFilter },
                        { dueTime: dueTimeFilter },
                        { status: statusFilter },
                        {
                          labels: labelsFilter,
                        },
                      ],
                    },
                    include: {
                      labels: true,
                    },
                  },
                },
              },
              UserBoardRelation: {
                include: {
                  user: {
                    include: {
                      Todos: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getActiveUsers(userId: number) {
  return await prisma.user.findMany({
    where: {
      isDisabled: false,
      // id: {
      //   not: userId,
      // },
    },
    include: {
      UserBoardRelation: true,
    },
    take: 10,
  });
}

export async function getUserLayoutBoards(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Boards: {
        include: {
          UserBoardRelation: true,
        },
      },
      UserBoardRelation: {
        where: {
          board: {
            creatingUserid: {
              not: userId,
            },
          },
        },
        select: {
          board: {
            include: {
              UserBoardRelation: true,
            },
          },
        },
      },
    },
  });
}

export async function getUserFavoriteBoards(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
      UserBoardRelation: {
        some: {
          isFavorite: true,
        },
      },
    },
    include: {
      Boards: {},
    },
  });
}

export async function updateUserCredentials({
  email,
  avatar,
  userId,
}: Prisma.UserUpdateInput & { userId: number }) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      avatar,
    },
  });
}
