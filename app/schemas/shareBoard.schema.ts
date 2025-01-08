import { z } from "zod";
import { combinePermissions, Permissions } from "~/utils/permissions";

export const permissionsTypes = {
  manager: String(combinePermissions(Permissions.WRITE, Permissions.DELETE)),
  editor: String(combinePermissions(Permissions.WRITE)),
  viewer: String(combinePermissions()),
} as const;

export const permissionsArray = Object.entries(permissionsTypes).map(
  ([key, value]) => ({
    key,
    value
  })
);

export const shareBoardSchema = z.object({
  boardId: z.number(),
  userId: z.number(),
  permission: z.nativeEnum(permissionsTypes, {
    required_error: "You need to select a permission type.",
  }),
});

export const permissionType = shareBoardSchema.omit({
  boardId: true,
  userId: true,
});
