export type FetchType<T> =
  | {
      withQuery: false;
    }
  | {
      withQuery: true;
      data: T;
    };
//gets the keys of T and the keys of paginated T
// export type DataTypes<K extends string, T> = keyof FullResponseMap<K, T>;
