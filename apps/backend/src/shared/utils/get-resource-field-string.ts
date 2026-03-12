type KeysOfType<T, TValue> = {
  [K in keyof T]: T[K] extends TValue ? K : never;
}[keyof T];

export function getResourceFieldString<
  TData,
  K extends KeysOfType<TData, string | null>,
>(resource: TData, resourceAsset: K): TData[K] {
  return resource[resourceAsset];
}
