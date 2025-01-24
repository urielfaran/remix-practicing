import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import { resetStatus } from "~/utils/notofications.server";
import type { Route } from "./+types/notifications-test";

export async function action({ request }: Route.ActionArgs) {
  const userId = await authenticator.requireUser(request, "/login");

  invariant(userId, "user is not logged in");

  const a = await resetStatus(Number(userId));
  return { a };
}
