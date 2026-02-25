import { UserSession } from "@repo/contracts/dto/auth";
import { AuthorizationError } from "./error.ts";
import { hasPermission, Permissions } from "@repo/contracts/auth-abac";

export function requirePermission<Resource extends keyof Permissions>({
  user,
  resource,
  action,
  data,
}: {
  user: UserSession;
  resource: Resource;
  action: Permissions[Resource]["action"];
  data?: Permissions[Resource]["dataType"];
}) {
  if (!hasPermission({ user, resource, action, data })) {
    throw new AuthorizationError({ action, resource });
  }
}
