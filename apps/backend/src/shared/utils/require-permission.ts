import { UserSession } from "@repo/contracts/dto/auth";
import { AuthorizationError } from "../errors/index.js";
import { cantAssignRole } from "@/shared/utils/cannot-assign-role.js";
import {
  Action,
  hasPermission,
  PermissionMap,
  Resource,
} from "@repo/contracts/auth/permissions/resource";

export function requirePermission<R extends Resource, A extends Action<R>>({
  user,
  resource,
  action,
  ctx,
}: {
  user: UserSession;
  resource: R;
  action: A;
  ctx: PermissionMap[R][A];
}) {
  if (!hasPermission({ user, resource, action, ctx })) {
    if (resource == "users" && action == "changeRole") {
      cantAssignRole({
        userRole: user.role,
        ctx: ctx as PermissionMap["users"]["changeRole"],
      });
    }
    throw new AuthorizationError({ action, resource });
  }
}
