type SortWithDirection<T extends readonly string[]> =
  | `asc(${T[number]})`
  | `desc(${T[number]})`;

export function createSortWithDirection<T extends readonly string[]>(
  fields: T,
): readonly SortWithDirection<T>[] {
  return fields.flatMap(
    (field) => [`asc(${field})`, `desc(${field})`] as const,
  ) as readonly SortWithDirection<T>[];
}
