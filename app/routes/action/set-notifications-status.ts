import {
  getNotificationsStatus,
  setNotificationsStatus,
} from "~/utils/notofications.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/update-board-permission";

export async function action({ request }: Route.ActionArgs) {
  const itemsId = (await getRequestField("itemsId", request, {
    stringified: false,
  })) as string; // Assuming `itemsId` is returned as a comma-separated string

  const itemsIdArray = itemsId.split(",").map((id) => parseInt(id, 10));
  //   const notificationsIds = itemsId.map((n: string) => Number(n))
//   const test = await getNotificationsStatus(itemsIdArray);
//   console.log(test);

  try {
    await setNotificationsStatus(itemsIdArray);
  } catch (errors) {}
  return { itemsId };
}
