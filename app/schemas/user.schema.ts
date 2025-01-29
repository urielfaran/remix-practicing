import { z } from "zod";

export const userBaseSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const userCredentialsSchema = z.object({
  email: z.string().email().nullable().optional(),
  avatar: typeof window === "undefined" ? z.any() : z.instanceof(FileList),
});

export enum usersStatusOptions {
  board_related = "board_related",
  unrelated = "unrelated",
  related_with_current = "related_with_current",
  todo_related = "todo_related",
}

export const getUsersSchema = z.object({
  boardId: z.number().optional(),
  todoId: z.number().optional(),
  usersStatus: z.nativeEnum(usersStatusOptions),
});

