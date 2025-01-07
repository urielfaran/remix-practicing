import { createContext, PropsWithChildren, useContext } from "react";
import { hasPermission } from "~/utils/permissions";

type userPermissionContextType = number;
export const userPermissionContext =
  createContext<userPermissionContextType>(0);

export function usePermission() {
  const userPermissions = useContext(userPermissionContext);

  function checkPermission(permissions: number) {
    return hasPermission(userPermissions, permissions);
  }

  return { userPermissions, checkPermission };
}

interface UserPermissionProvider extends PropsWithChildren {
  value: userPermissionContextType;
}
export function UserPermissionProvider({
  children,
  value,
}: UserPermissionProvider) {
  return (
    <userPermissionContext.Provider value={value}>
      {children}
    </userPermissionContext.Provider>
  );
}
