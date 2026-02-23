import { ilike, or, sql, SQL, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { AuthorTable } from "../../db/schemas/authors.ts";
import { ServiceResult } from "../../types/index.ts";
import { PAGE_SIZE } from "../../constants/index.ts";

export const createAuthorService = async (
  author: typeof AuthorTable.$inferInsert,
): Promise<ServiceResult<typeof AuthorTable.$inferSelect>> => {
  try {
    const result = await db.insert(AuthorTable).values(author).returning();
    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Internal Server Error",
      };
    }

    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("name")) {
      return {
        type: "database",
        success: false,
        message: "Name is already taken",
      };
    }

    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};

export const deleteAuthorService = async (
  authorId: string,
): Promise<ServiceResult<typeof AuthorTable.$inferSelect>> => {
  try {
    const result = await db
      .delete(AuthorTable)
      .where(eq(AuthorTable.id, authorId))
      .returning();

    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Author does not exist",
      };
    }

    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err) {
    console.error(err);
    return {
      type: "unknown",
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const updateAuthorService = async (
  author: Partial<typeof AuthorTable.$inferInsert>,
  id: string,
): Promise<ServiceResult<typeof AuthorTable.$inferSelect>> => {
  try {
    const result = await db
      .update(AuthorTable)
      .set(author)
      .where(eq(AuthorTable.id, id))
      .returning();
    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Author does not exist",
      };
    }

    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("name")) {
      return {
        type: "validation",
        success: false,
        message: "Name is already taken",
      };
    }

    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
