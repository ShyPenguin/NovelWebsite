import { Link, type LinkProps } from "@tanstack/react-router";
import { useHasPermission } from "@/hooks/useHasPermission";
import type { Resource, Permissions } from "@repo/contracts/auth/permissions";

type ProtectedLinkProps = LinkProps & {
  permissionArgs: {
    resource: Resource;
    action: Permissions[Resource]["action"];
    data?: Permissions[Resource]["dataType"];
  };
  className: string;
};

export const ProtectedLink = ({
  permissionArgs,
  children,
  className,
  ...rest
}: ProtectedLinkProps) => {
  const canAccess = useHasPermission(permissionArgs);

  if (!canAccess) return null;

  return (
    <Link {...rest} className={className}>
      {children}
    </Link>
  );
};
