import { CustomizedAuthorizationError } from "@/shared/errors/index.ts";
import { PermissionMap, ROLE_RANK } from "@repo/contracts/auth/permissions";
import { UserRole } from "@repo/contracts/dto/auth";

export const cantAssignRole = ({
  userRole,
  ctx,
}: {
  userRole: UserRole;
  ctx: PermissionMap["users"]["changeRole"];
}) => {
  const payload = ctx.payload.role;
  if (ROLE_RANK[payload] < ROLE_RANK[userRole]) {
    throw new CustomizedAuthorizationError(
      `${userRole}s cannot assign ${payload} role`,
    );
  }
};
