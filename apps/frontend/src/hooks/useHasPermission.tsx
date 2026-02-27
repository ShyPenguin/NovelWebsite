import { queryAuthOption } from "@/api/auth/auth";
import {
  hasPermission,
  type Permissions,
} from "@repo/contracts/auth/permissions";
import { useQuery } from "@tanstack/react-query";

export const useHasPermission = <Resource extends keyof Permissions>({
  resource,
  action,
  data,
}: {
  resource: Resource;
  action: Permissions[Resource]["action"];
  data?: Permissions[Resource]["dataType"];
}) => {
  const { data: user } = useQuery(queryAuthOption());

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
