import { UserSession } from "@repo/contracts/dto/auth";
import { AuthorizationError } from "../errors/index.ts";
import {
  Action,
  hasPermission,
  PermissionMap,
  Resource,
} from "@repo/contracts/auth/permissions";

export function requirePermission<R extends Resource, A extends Action<R>>({
  user,
  resource,
  action,
  ctx,
}:
  | {
      user: UserSession;
      resource: R;
      action: A;
      ctx?: never;
    }
  | {
      user: UserSession;
      resource: R;
      action: A;
      ctx: PermissionMap[R][A];
    }) {
  if (ctx !== undefined && !hasPermission({ user, resource, action, ctx })) {
    throw new AuthorizationError({ action, resource });
  }

  if (!hasPermission({ user, resource, action })) {
    throw new AuthorizationError({ action, resource });
  }
}
