import { VIEW, PREVIEW } from "@/constants";
import { queryClient } from "@/routes";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import type { Action, Resource } from "@repo/contracts/auth/permissions";

export const mutationConfig = <T>({
  action,
  resource,
  queryArg,
  getQueryKey,
}: {
  action: Exclude<Action, typeof VIEW | typeof PREVIEW>;
  resource: Resource;
  queryArg: {
    getListQueryKey: ({
      id,
    }: {
      id?: string;
    }) => (string | number | undefined)[];
    exact: boolean;
  };
  getQueryKey: ({ id }: { id: string }) => (string | number | undefined)[];
}) => {
  return {
    onSuccess: async ({
      data,
      id,
      parentId,
    }: {
      data: T;
      id: string;
      parentId?: string;
    }) => {
      // Update single novel cache
      queryClient.setQueryData(getQueryKey({ id }), data);

      // Invalidate lists
      await queryClient.invalidateQueries({
        queryKey: queryArg.getListQueryKey(parentId ? { id: parentId } : {}),
        exact: queryArg.exact,
        refetchType: "active",
      });

      toast.success(
        `${capitalizeFirstLetter(resource.slice(0, resource.length - 1))} successfully ${action.toLocaleLowerCase()}d`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  };
};
