import { create } from "zustand";
import { BoardWithData } from "~/components/board-components/BoardHeader";

interface BoardState {
  board: BoardWithData | null;
  setBoard: (board: BoardWithData) => void;
}

export const getUniqueColors = (board: BoardWithData) => {
  const uniqueColors = [
    ...new Set(
      board?.lists
        .flatMap((list) => list.todos)
        .flatMap((todo) => todo.labels)
        .map((label) => label.backgroundColor)
        .filter(Boolean)
    ),
  ];
  uniqueColors.sort();

  return uniqueColors;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  setBoard: (board) => set({ board }),
}));
