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
    value,
  })
);

export const permissionType = z.object({
  permission: z.nativeEnum(permissionsTypes),
});

export const userBoardSchema = z.object({
  boardId: z.number(),
  userId: z.number(),
});

export const shareBoardSchema = permissionType.merge(userBoardSchema);

export const addPermissionsSchema = permissionType.merge(
  z.object({
    userId: z.number(),
  })
);
