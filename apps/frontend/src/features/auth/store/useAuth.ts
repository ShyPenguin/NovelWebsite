import { useQuery } from "@tanstack/react-query";
import { queryAuthOption } from "../api/auth";

export const useAuth = () => {
  return useQuery(queryAuthOption());
};
