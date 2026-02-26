import { createAuthorTx } from "@/features/authors/repositories/create.repository.ts";
import { testDb } from "tests/integrated/db/db-test.ts";
import data from "tests/mockdb.json" with { type: "json" };

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
