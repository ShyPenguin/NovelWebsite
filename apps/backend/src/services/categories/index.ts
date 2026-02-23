import { ilike, or, SQL, sql, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { CategoryTable } from "../../db/schemas/index.ts";
import { ServiceResult } from "../../types/index.ts";
import { PAGE_SIZE } from "../../constants/index.ts";

export const createCategoryService = async (
  category: typeof CategoryTable.$inferInsert,
): Promise<ServiceResult<typeof CategoryTable.$inferSelect>> => {
  try {
    const result = await db.insert(CategoryTable).values(category).returning();
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

export const getCategoriesService = async (
  query: Record<string, any>,
  page: number | 1,
  select?: Record<string, any>,
): Promise<ServiceResult<any>> => {
  try {
    const { filters, baseQuery } = preparingQuery(query, select);

    const { baseQuery: countQuery } = preparingQuery(query, {
      count: sql<number>`count(*)`,
    });

    if (filters.length > 0) {
      countQuery.where(or(...filters));
      baseQuery.where(or(...filters));
    }

    const categoriesPromise = baseQuery
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    const [categories, totalResult] = await Promise.all([
      categoriesPromise,
      countQuery,
    ]);

    const total = Number(totalResult[0]?.count) ?? 0;

    if (categories.length < 1) {
      return {
        success: false,
        type: "database",
        message: "Empty Data",
      };
    }
    const totalPage = Math.ceil(total / PAGE_SIZE);
    return {
      success: true,
      data: { categories, currentPage: page, totalPage },
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};

export const preparingQuery = (
  query: Record<string, any>,
  select?: Record<string, any>,
): { filters: SQL[]; baseQuery: any } => {
  const filters: SQL[] = [];
  const shouldUseSelectArg = select && Object.keys(select).length > 0;

  const base = shouldUseSelectArg
    ? db.select(select as Record<string, any>)
    : db.select();

  let baseQuery = base.from(CategoryTable);

  if (query.name) {
    filters.push(ilike(CategoryTable.name, `%${query.name}%`));
  }

  return { filters, baseQuery };
};

export const getCategoryOneService = async (
  id: string,
): Promise<ServiceResult<any>> => {
  try {
    const result = await db
      .select()
      .from(CategoryTable)
      .where(eq(CategoryTable.id, id));

    if (result.length < 1) {
      return {
        success: false,
        type: "database",
        message: "Category does not exist",
      };
    }

    return { success: true, data: result[0] };
  } catch (err) {
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};

export const deleteCategoryService = async (
  id: string,
): Promise<ServiceResult<typeof CategoryTable.$inferSelect>> => {
  try {
    const result = await db
      .delete(CategoryTable)
      .where(eq(CategoryTable.id, id))
      .returning();

    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Category does not exist",
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

export const updateCategoryService = async (
  category: Partial<typeof CategoryTable.$inferInsert>,
  id: string,
): Promise<ServiceResult<typeof CategoryTable.$inferSelect>> => {
  try {
    const result = await db
      .update(CategoryTable)
      .set(category)
      .where(eq(CategoryTable.id, id))
      .returning();
    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Category does not exist",
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
