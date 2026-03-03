import { z } from "zod";
import { createEnumError } from "./createEnumError";

type SortWithDirection<T extends readonly string[]> =
  | `asc(${T[number]})`
  | `desc(${T[number]})`;

export function createSortWithDirection<T extends readonly string[]>(
  fields: T,
) {
  return fields.flatMap(
    (field) => [`asc(${field})`, `desc(${field})`] as const,
  ) as readonly SortWithDirection<T>[];
}

export function createSortWithDirectionField<T extends readonly string[]>(
  fields: T,
) {
  const values = createSortWithDirection(fields);

  return z.enum(values as [SortWithDirection<T>, ...SortWithDirection<T>[]], {
    message: `${createEnumError({ fieldName: "Sort", array: values })}`,
  });
}
