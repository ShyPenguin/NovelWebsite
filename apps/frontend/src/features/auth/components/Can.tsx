import {
  type Resource,
  type Action,
  type PermissionMap,
  hasPermission,
} from "@repo/contracts/auth/permissions/resource";
import {
  type Feature,
  hasFeature,
} from "@repo/contracts/auth/permissions/feature";
import { useAuth } from "../store/useAuth";

type ResourceCanProps<R extends Resource, A extends Action<R>> = {
  resource: R;
  action: A;
  ctx: PermissionMap[R][A];
  feature?: never;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type FeatureCanProps = {
  feature: Feature;
  resource?: never;
  action?: never;
  ctx?: never;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type CanProps<R extends Resource, A extends Action<R>> =
  | ResourceCanProps<R, A>
  | FeatureCanProps;

export function Can<R extends Resource, A extends Action<R>>({
  resource,
  action,
  ctx,
  children,
  fallback = undefined,
  feature,
}: CanProps<R, A>) {
  const { data: user } = useAuth();

  if (!user) return <>{fallback ?? null}</>;

  let allowed = false;

  if (feature) {
    allowed = hasFeature(user, feature);
  } else {
    allowed = hasPermission({
      user,
      resource: resource,
      action: action,
      ctx: ctx,
    });
  }

  if (!allowed) {
    return <>{fallback ?? null}</>;
  }

  return <>{children}</>;
}
