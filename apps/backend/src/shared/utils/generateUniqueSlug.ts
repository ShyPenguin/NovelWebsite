import slugify from "slugify";
import { AnyColumn, eq } from "drizzle-orm";
import { DbExecTypes } from "@/infrastructure/db/type.js";
import { PgTable } from "drizzle-orm/pg-core";

export async function generateUniqueSlug({
  tx,
  table,
  slugColumn,
  value,
}: {
  tx: DbExecTypes;
  table: PgTable;
  slugColumn: AnyColumn;
  value: string;
}) {
  const baseSlug = slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (!baseSlug) {
    throw new Error("Unable to generate slug");
  }

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await tx
      .select()
      .from(table)
      .where(eq(slugColumn, slug))
      .limit(1);

    if (existing.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
