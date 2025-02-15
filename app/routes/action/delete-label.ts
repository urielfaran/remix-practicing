import { data } from "react-router";
import invariant from "tiny-invariant";
import { deleteLabel } from "~/utils/label.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/delete-label";

export async function action({ request }: Route.ActionArgs) {
  const id = await getRequestField("id", request, {
    stringified: false,
  });
  invariant(id);

  try {
    await deleteLabel(Number(id));
  } catch (errors) {
    return data(
      {
        errors,
        id,
        toastTitle: "Label Deletion Has Been Failed",
        toastContent: "Could not delete label!",
      },
      { status: 400 }
    );
  }
  return data({
    toastTitle: "Label Has Been Deleted",
    toastContent: "Label has been deleted successfully!",
  });
}
