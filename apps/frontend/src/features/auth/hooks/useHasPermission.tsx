import {
  hasPermission,
  type Permissions,
} from "@repo/contracts/auth/permissions";
import { useAuth } from "../store/useAuth";

export const useHasPermission = <Resource extends keyof Permissions>({
  resource,
  action,
  data,
}: {
  resource: Resource;
  action: Permissions[Resource]["action"];
  data?: Permissions[Resource]["dataType"];
}) => {
  const user = useAuth((s) => s.user);

  return user
    ? hasPermission({
        user: {
          id: user.id,
          role: user.role,
        },
        resource,
        action,
        data,
      })
    : null;
};
