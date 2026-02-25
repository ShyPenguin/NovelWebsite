import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { AuthorTable } from "../../db/schemas/authors.ts";
import { ServiceResult } from "../../types/index.ts";
import { PAGE_SIZE } from "../../constants/index.ts";

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
