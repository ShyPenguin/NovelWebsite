import type {
  PermissionMap,
  Resource,
  Action,
} from "@repo/contracts/auth/permissions";
import { useHasPermission } from "../hooks/useHasPermission";

type CanProps<R extends Resource, A extends Action<R>> = {
  resource: R;
  action: A;
  ctx: PermissionMap[R][A];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Can<R extends Resource, A extends Action<R>>({
  resource,
  action,
  ctx,
  children,
  fallback = null,
}: CanProps<R, A>) {
  const allowed = useHasPermission({ resource, action, ctx });

  if (allowed === null) return null; // loading
  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}
