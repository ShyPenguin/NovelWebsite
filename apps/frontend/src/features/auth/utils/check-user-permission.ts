import { redirect } from "@tanstack/react-router";
import { useAuthUIStore } from "@/features/auth/store/useAuthUIStore";
import { queryClient } from "@/routes";
import {
  hasPermission,
  type Action,
  type PermissionMap,
  type Resource,
} from "@repo/contracts/auth/permissions/resource";
import {
  hasFeature,
  type Feature,
} from "@repo/contracts/auth/permissions/feature";
import { queryAuthOption } from "../api/auth";

type ResourceParam<R extends Resource, A extends Action<R>> = {
  resource: R;
  action: A;
  ctx: PermissionMap[R][A];
  location: string;
  feature?: never;
};

type FeatureParam = {
  feature: Feature;
  location: string;
  resource?: never;
  action?: never;
  ctx?: never;
};

type Params<R extends Resource, A extends Action<R>> =
  | ResourceParam<R, A>
  | FeatureParam;

export async function checkUserPermission<
  R extends Resource,
  A extends Action<R>,
>({ location, resource, action, ctx, feature }: Params<R, A>) {
  const user = await queryClient.ensureQueryData(queryAuthOption());

  if (!user) {
    useAuthUIStore.getState().requireLogin();
    throw redirect({ to: location });
  }

  if (feature && !hasFeature(user, feature)) {
    useAuthUIStore.getState().requirePermission("You don't have this feature");
    throw redirect({ to: location });
  }

  if (
    !feature &&
    !hasPermission({
      user,
      resource,
      action,
      ctx,
    })
  ) {
    useAuthUIStore
      .getState()
      .requirePermission("You don't have enough authority");
    throw redirect({ to: location });
  }

  return user;
}
