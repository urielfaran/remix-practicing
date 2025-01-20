export const Permissions = {
  WRITE: 1 << 0, // 0x001 (1)
  DELETE: 1 << 1, // 0x002 (2)
} as const;

export type PermissionKey = keyof typeof Permissions;
export type PermissionValue = (typeof Permissions)[PermissionKey];

/**
 * Combines multiple permissions into a single integer using bitmasking.
 */
export const combinePermissions = (
  ...permissions: PermissionValue[]
): number => {
  return permissions.reduce((acc, perm) => acc | perm, 0);
};

/**
 * Checks if a specific permission exists in the provided permission set.
 */
export const hasPermission = (
  userPermissions: number,
  permission: PermissionValue
): boolean => {
  return (userPermissions & permission) === permission;
};
interface PermissionState {
  permissions: number;
  setPermissions: (permissions: number) => void;
  hasPermission: (requiredPermission: number) => boolean;
}

import { create } from "zustand";

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: 0,
  setPermissions: (permissions) => set({ permissions }),
  hasPermission: (requiredPermission) => {
    const { permissions } = get();
    console.log(permissions)
    return (permissions & requiredPermission) === requiredPermission;
  },
}));
