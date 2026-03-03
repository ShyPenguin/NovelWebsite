export const createEnumError = <T extends readonly string[]>({
  fieldName,
  array,
}: {
  fieldName: string;
  array: T;
}): string => {
  const fullText = array
    .map((item, i, arr) =>
      i === 0 ? item : i === arr.length - 1 ? ` or ${item}` : `, ${item}`,
    )
    .join("");

  return `${fieldName} must be either ${fullText}`;
};
