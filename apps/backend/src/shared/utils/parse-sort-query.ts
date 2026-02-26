import { sql } from "drizzle-orm";

export function parseSortQuery({
  sortParam,
  sortableColumns,
}: {
  sortParam?: string;
  sortableColumns: Record<string, { name: string }>;
}) {
  if (!sortParam) return [];

  return sortParam
    .split(",")
    .map((clause) => {
      clause = clause.trim();

      // asc(col) / desc(col)
      const fnMatch = clause.match(/^(asc|desc)\((\w+)\)$/i);
      if (fnMatch) {
        const [, dir, col] = fnMatch;
        const columnRef = sortableColumns[col];
        if (!columnRef) return null;

        return sql.raw(`"${columnRef.name}" ${dir.toUpperCase()}`);
      }

      // col → default DESC
      const columnRef = sortableColumns[clause];
      if (!columnRef) return null;

      return sql.raw(`"${columnRef.name}" DESC`);
    })
    .filter((x): x is ReturnType<typeof sql.raw> => x !== null);
}
