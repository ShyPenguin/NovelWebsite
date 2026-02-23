import { GET, PREVIEW } from "@/constants";
import { queryClient } from "@/routes";
import type { Actions, Resources } from "@/types";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

export const mutationConfig = <T extends { id: string }>({
  action,
  resource,
  queryArg,
  getMutateKey,
}: {
  action: Exclude<Actions, typeof GET | typeof PREVIEW>;
  resource: Resources;
  queryArg: {
    getListMutatekey: ({
      id,
    }: {
      id?: string;
    }) => (string | number | undefined)[];
    exact: boolean;
  };
  getMutateKey: ({ id }: { id: string }) => (string | number | undefined)[];
}) => {
  return {
    onSuccess: async (data: T, parentId?: string) => {
      // Update single novel cache
      queryClient.setQueryData(getMutateKey({ id: data.id }), data);

      // Invalidate lists
      await queryClient.invalidateQueries({
        queryKey: queryArg.getListMutatekey(parentId ? { id: parentId } : {}),
        exact: queryArg.exact,
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
