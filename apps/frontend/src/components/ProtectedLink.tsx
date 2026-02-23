import { useHasRole } from "@/hooks/useHasRole";
import { Link, type LinkProps } from "@tanstack/react-router";
import type { UserRole } from "@repo/contracts/dto/auth";

type ProtectedLinkProps = LinkProps & {
  allowedRoles: UserRole[];
  className?: string;
};

export const ProtectedLink = ({
  allowedRoles,
  children,
  className,
  ...rest
}: ProtectedLinkProps) => {
  const canAccess = useHasRole(allowedRoles);

  if (!canAccess) return null;

  return (
    <Link
      {...rest}
      className={`full-button bg-secondary dark:bg-secondary-black dark:text-white ${className ?? ""}`}
    >
      {children}
    </Link>
  );
};
