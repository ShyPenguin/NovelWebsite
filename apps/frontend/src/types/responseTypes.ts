import type { Paginated } from ".";

// This iterates over the generic data map and create paginated keys i.e
// "all" key in NovelResponseMap will be made as "paginated.all" in here
export type PaginatedResponseMap<T> = {
  [K in keyof T as `paginated.${K & string}`]: Paginated<T[K]>;
};

export type FullResponseMap<T> = T & PaginatedResponseMap<T>;
