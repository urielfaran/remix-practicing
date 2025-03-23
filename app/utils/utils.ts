import moment from "moment";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import { getUserById } from "./user.server";
import _ from "lodash";
import { prisma } from "~/db.server";

export async function getRequestField(
  name: string,
  request: Request,
  options: {
    stringified: boolean;
  } = {
    stringified: true,
  }
) {
  // clone the request to get a copy because we have error when trying read the same
  // request twice and to not modify the original request
  const requestClone = request.clone();
  const formData = await requestClone.formData();

  const _action = formData.get(name)?.toString() ?? "";
  // parse the _action from the form data, parsing is needed because the form data is stringified
  return options.stringified ? JSON.parse(_action) : _action;
}

export function formatUtc(initialDateStr: Date) {
  // Initial date string
  const date = moment.utc(initialDateStr);

  // Get the local timezone offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset();

  // Convert offset from minutes to hours
  const offsetHours = offsetMinutes / 60;

  // Adjust the date based on the local timezone offset
  date.add(-offsetHours, "hours");
  return date.startOf("day").toDate();
}

export async function getUserDateForNotification(request: Request) {
  const sendindUserId = await authenticator.requireUser(request, "/login");
  invariant(sendindUserId, "user is not logged in");

  const numberSendingUserId = Number(sendindUserId);

  const user = await prisma.user.findUnique({
    where: { id: numberSendingUserId },
    include: {
      UserBoardRelation: true,
    },
  });;

  const username = user?.username;

  return { sendindUserId: numberSendingUserId, username };
}

export function getGroupedParamsByType(url: URL) {
  const groupedParams = _.groupBy(
    url.searchParams.getAll("filter"),
    (param) => param.split(":")[0]
  );

  const paramsByType = _.mapValues(groupedParams, (group) =>
    group.map((item) => item.split(":")[1])
  );
  return paramsByType;
}

