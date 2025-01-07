import { z } from "zod";

export const permissionsTypes = {
  delete: "manager",
  edit: "editor",
  view: "viewer",
} as const;

export const permissionsArray = Object.entries(permissionsTypes).map(([key, value]) => ({
  key,
  value,
}));

export const shareBoardSchema = z.object({
  boardId: z.number(),
  userId: z.number(),
  type: z.enum(Object.keys(permissionsTypes) as [keyof typeof permissionsTypes], {
    required_error: "You need to select a permission type.",
  }),
});

export const permissionType = shareBoardSchema.omit({
  boardId: true,
  userId: true,
});
