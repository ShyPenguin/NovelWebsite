import { AuthorTable } from "@/db/schemas/authors.ts";
import { DbExecTypes } from "@/db/type.ts";
import { authorSelectMap } from "@/types/selections/authorSelections.ts";
import { AuthorSelectDTO } from "@repo/contracts/dto/author";
import { sql } from "drizzle-orm";

export const buildAuthorsBaseQuery = ({
  type,
  tx,
}: {
  type: AuthorSelectDTO;
  tx: DbExecTypes;
}) => {
  const select = authorSelectMap[type];

  switch (type) {
    case "detail": {
      return tx.select(select).from(AuthorTable);
    }
  }
};

export const buildAuthorCountQuery = ({ tx }: { tx: DbExecTypes }) => {
  return tx
    .select({
      count: sql<number>`count(distinct ${AuthorTable.id})`,
    })
    .from(AuthorTable);
};

export type AuthorBaseQuery = ReturnType<
  typeof buildAuthorsBaseQuery | typeof buildAuthorCountQuery
>;
