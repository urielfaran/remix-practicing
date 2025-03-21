import { data } from "react-router";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import { userParamsSchema } from "~/schemas/params.schema";
import { getUsers } from "~/utils/user.server";
import { Route } from "./+types/get-users";

export async function loader({ request, params }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  invariant(userId, "user is not logged in");

  const url = new URL(request.url);
  const urlParams = Object.fromEntries(url.searchParams);
  const result = userParamsSchema.safeParse(urlParams);

  if (!result.success) {
    console.log(result.error.errors, result.data);
    return data(result.error);
  }

  const referer = request.headers.get("Referer");
  invariant(referer, "referer must exist");

  const pathSegments = referer.split("/");
  const boardId = pathSegments[pathSegments.indexOf("board") + 1];

  const { page, userStatus, todoId, search } = result.data;

  const users = await getUsers({
    boardId: Number(boardId),
    userId: Number(userId),
    userStatus,
    page,
    todoId,
    search,
  });
  // console.log(users);

  return { items: users, page };
}
