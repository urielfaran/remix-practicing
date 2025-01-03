import { data, redirect } from "react-router";
import invariant from "tiny-invariant";
import { deleteBoard } from "~/utils/board.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/delete-board";

export async function action({ request }: Route.ActionArgs) {
  const id = await getRequestField("id", request, {
    stringified: false,
  });
  invariant(id);

  try {
    await deleteBoard(Number(id));
  } catch (errors) {
    return data(
      {
        errors,
        id,
        toastTitle: "Todo Deletion Has Been Failed",
        toastContent: "Could not delete todo!",
      },
      { status: 400 }
    );
  }
  // const session = await getSession(request.headers.get("Cookie"));
  // session.flash("toastTitle", "Todo Has Been Deleted");
  // session.flash("toastContent", "Todo has been deleted successfully!");

  return redirect(
    "/"
    //    {
    //   headers: {
    //     "Set-Cookie": await commitSession(session),
    //   },
    // }
  );
}
