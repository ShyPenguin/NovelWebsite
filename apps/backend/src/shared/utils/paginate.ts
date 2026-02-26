import { Paginated } from "@repo/contracts/dto/paginated";

export const paginate = async ({
  query,
  countQuery,
  page,
  pageSize,
  sort = [],
}: {
  query: any;
  countQuery: any;
  page: number;
  pageSize: number;
  sort?: any;
}): Promise<Paginated<any>> => {
  const [items, totalResult] = await Promise.all([
    query
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(...sort),
    countQuery,
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  return {
    items,
    currentPage: page,
    totalPage: Math.ceil(total / pageSize),
  };
};
