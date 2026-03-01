import type { NovelDetailDTO } from "@repo/contracts/dto/novel";

export const getNovelOneQueryKey = ({ id }: { id: NovelDetailDTO["id"] }) => {
  return ["novel", id];
};

export const getNovelsQueryKey = ["novels"];
