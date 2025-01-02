import { Star } from "lucide-react";
import { useFetcher } from "react-router";
import useResponseToast, { ToastProps } from "~/hooks/useResponseToast";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { favoriteBoardSchema } from "~/schemas/board.schema";

interface FavoriteBoardProps {
  boardId: number;
  isFavorite: boolean;
}

export type favoriteBoardSchemaType = z.infer<typeof favoriteBoardSchema>;
export const favoriteBoardResolver = zodResolver(favoriteBoardSchema);

function FavoriteBoard({ boardId, isFavorite }: FavoriteBoardProps) {
  const fetcher = useFetcher<ToastProps>();
  useResponseToast(fetcher.data);
  return (
    <fetcher.Form method="POST" action="/action/favorite-board">
      <Button
        className="hover:scale-125 hover:bg-transparent z-10 transition delay-150 duration-300 ease-in-out"
        variant={"ghost"}
        size={"sm"}
        type="submit"
        onClick={(e) => e.stopPropagation()}
      >
        <Star
          className={`${isFavorite ? "text-yellow-400 fill-yellow-300" : ""}`}
        />
      </Button>
      <input type="text" hidden readOnly value={boardId} name="id" />
      <input
        type="hidden"
        value={isFavorite ? "true" : "false"}
        name="favorite-status"
      />
    </fetcher.Form>
  );
}

export default FavoriteBoard;
