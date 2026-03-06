import {
  hasPermission,
  type Action,
  type PermissionMap,
  type Resource,
} from "@repo/contracts/auth/permissions";
import { useAuth } from "../store/useAuth";

export const useHasPermission = <R extends Resource, A extends Action<R>>({
  resource,
  action,
  ctx,
}: {
  resource: R;
  action: A;
  ctx: PermissionMap[R][A];
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
        ctx,
      })
    : null;
};
