import { createAuthorTx } from "../../../../../src/repositories/authors/create.ts";
import data from "../../../../mockdb.json" with { type: "json" };
import { testDb } from "../../../db/db-test.ts";
export const seedBeforeAll = async () => {
  // 14 total in Authors
  const sortedAuthors = data.authors.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const authors = await Promise.all(
    sortedAuthors.map((author) =>
      createAuthorTx({
        tx: testDb,
        form: author,
      }),
    ),
  );

  const searchedAuthors = authors.filter((author) =>
    author.name.includes("Cu"),
  );
  return {
    getAuthor: () => authors[0],
    getSearchedAuthor: () => searchedAuthors,
  };
};
