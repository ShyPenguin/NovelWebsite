import { queryAuthOption } from "@/api/auth/auth";
import { useQuery } from "@tanstack/react-query";

export const useHasRole = (roles: string[]) => {
  const { data } = useQuery(queryAuthOption());
  return data ? roles.includes(data.role) : false;
};
