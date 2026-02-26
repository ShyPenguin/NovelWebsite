import { Paginated } from "@repo/contracts/dto/paginated";

export type PaginationArgs<P extends boolean> = P extends true
  ? {
      page: number; // ✅ required
      pageSize: number; // ✅ required
    }
  : {
      page?: never; // 🚫 not allowed
      pageSize?: never; // 🚫 not allowed
    };

export type GetListParams<TBaseArgs, P extends boolean> = TBaseArgs &
  PaginationArgs<P>;

export type GetServiceList<T extends string> = Record<
  T,
  {
    list: (params: any) => Promise<any>;
    paginated: (params: any) => Promise<any>;
  }
>;

export type GetFetchListReturn<
  T,
  K extends keyof T,
  P extends boolean,
> = P extends true ? Paginated<T[K]> : T[K];

export type GetFetchReturn<T, K extends keyof T> = T[K];
