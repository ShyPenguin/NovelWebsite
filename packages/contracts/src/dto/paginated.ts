export type Paginated<T> = {
  items: T;
  currentPage: number;
  totalPage: number;
};
