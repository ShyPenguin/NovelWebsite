import { deleteNovelMutate } from "@/api/novels/deleteNovel";
import { DELETE } from "@/constants";
import { mutationConfig } from "@/utils/mutation-configs";
import {
  getNovelOneQueryKey,
  getNovelsQueryKey,
} from "@/utils/tanstack-keys/novels";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import type { MutateOptions } from "@tanstack/react-query";

export const useNovelDelete = ({ id }: { id: NovelDetailDTO["id"] }) => {
  const mutation = deleteNovelMutate(id);
  const baseHandlers = mutationConfig({
    action: DELETE,
    resource: "novels",
    queryArg: {
      getListMutatekey: () => getNovelsQueryKey,
      exact: false,
    },
    getMutateKey: getNovelOneQueryKey,
  });

  const { mutate: _removed, ...rest } = mutation;

  return {
    mutate: ({
      options,
    }: {
      options?: MutateOptions<
        { id: NovelDetailDTO["id"] },
        unknown,
        { novelId: NovelDetailDTO["id"] }
      >;
    }) =>
      mutation.mutate(
        {
          novelId: id,
        },
        {
          ...baseHandlers,
          ...options,
          onSuccess: (data, vars, onResult, ctx) => {
            baseHandlers.onSuccess?.({ data, id: data.id });
            options?.onSuccess?.(data, vars, onResult, ctx);
          },
          onError(error, vars, onResult, ctx) {
            baseHandlers.onError(error);
            options?.onError?.(error, vars, onResult, ctx);
          },
        },
      ),

    ...rest,
  };
};
