import { data } from "react-router";
import invariant from "tiny-invariant";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/delete-list";
import { deleteList } from "~/utils/list.server";
export async function action({ request }: Route.ActionArgs) {
  const id = await getRequestField("id", request, {
    stringified: false,
  });
  invariant(id);

  try {
    await deleteList(Number(id));
  } catch (errors) {
    return data(
      {
        errors,
        id,
        toastTitle: "List Deletion Has Been Failed",
        toastContent: "Could not delete List!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "List Has Been Deleted",
    toastContent: "List has been deleted successfully!",
  });
}
