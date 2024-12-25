import { Board } from "@prisma/client";
import { useFetcher } from "react-router";

interface UpdateBoardInputProps {
  board: Board;
}
function UpdateBoardInput({ board }: UpdateBoardInputProps) {
  const fetcher = useFetcher();

  return (
    <div
      className="m-2 flex-1 outline-none"
      onBlur={(e) => {
        const editName = String(e.currentTarget.textContent).trim();
        if (board.name !== editName.trim()) {
          fetcher.submit(
            {
              name: JSON.stringify(String(e.target.textContent)),
              id: board.id,
              _action: JSON.stringify("update-board"),
            },
            {
              method: "post",
            }
          );
        }
      }}
      contentEditable
      dangerouslySetInnerHTML={{
        __html: fetcher.formData
          ? JSON.parse(fetcher.formData.get("name") as string)
          : board.name,
      }}
    />
  );
}

export default UpdateBoardInput;
