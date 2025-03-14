import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import {
  getNotifications,
  setNotificationsStatus,
} from "~/utils/notofications.server";
import type { Route } from "../api/+types/get-notifications";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  invariant(userId, "user is not logged in");

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 0);
  const notifications = await getNotifications(Number(userId));
  
  const notificationIds = notifications.map((n) => n.id);

  await setNotificationsStatus(notificationIds);

  return {
    notifications,
    page,
  };
}
