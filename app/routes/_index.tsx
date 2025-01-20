import { ActionFunctionArgs, data, redirect } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/authenticator";
import AddBoardButton from "~/components/action-buttons/AddBoardButton";
import DisplayBoard from "~/components/display-data/DisplayBoard";
import FilterBoards from "~/components/filter-components/FilterBoards";
import {
  createBoardResolver,
  createBoardSchemaType,
} from "~/components/forms/BoardForm";
import { UserIdContext } from "~/hooks/itemIdContexts";
import { createBoard, getFilterBoards } from "~/utils/board.server";
import { getUserById } from "~/utils/user.server";
import { getRequestField } from "~/utils/utils";
import type { Route } from "./+types/_index";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await authenticator.requireUser(request, "/login");
  const user = await getUserById(Number(userId));
  invariant(user, "user is not logged in");

  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";

  const boards = await getFilterBoards(user.id, query);

  return { boards, user };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { boards, user } = loaderData;
  return (
    <div className="w-4/5 mx-auto">
      <div className="flex flex-row justify-end">
        <FilterBoards />
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        <UserIdContext.Provider value={user.id}>
          <AddBoardButton />
        </UserIdContext.Provider>
        {boards.map((board, index) => {
          const permissions = user.UserBoardRelation.filter(
            (permission) => permission.boardId === board.id
          )[0].permissions;
          return (
            <DisplayBoard board={board} key={index} permissions={permissions} />
          );
        })}
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const _action = await getRequestField("_action", request);
  const userId = await authenticator.getUserId(request);

  invariant(userId, "user is required");

  switch (_action) {
    case "create-board": {
      const {
        errors,
        data: payload,
        receivedValues: defaultValues,
      } = await getValidatedFormData<createBoardSchemaType>(
        request,
        createBoardResolver
      );

      if (errors) {
        return data({ errors, defaultValues, payload }, { status: 400 });
      }
      try {
        const newBoard = await createBoard({
          name: payload.name,
          backgroundColor: payload.backgroundColor,
          creatingUserid: Number(userId),
        });
        return redirect(`/board/${newBoard.id}/${newBoard.name}`, {
          headers: {
            toastTitle: "Board Has Been Created",
            toastContent: "New board has been added to your list!",
          },
        });
      } catch (err) {
        return data(
          {
            err,
            payload,
            toastTitle: "Board Creation Has Been Failed",
            toastContent: "Could not create board!",
          },
          { status: 400 }
        );
      }
    }
    default:
      return null;
  }
}
