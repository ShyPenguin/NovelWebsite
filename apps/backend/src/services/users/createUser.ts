import { ServiceResult } from "../../types/index.ts";
import { UserTable } from "../../db/schemas/index.ts";
import { db } from "../../db/index.ts";

export const createUser = async (
  userData: any
): Promise<ServiceResult<typeof UserTable.$inferSelect>> => {
  try {
    const result = await db.insert(UserTable).values(userData).returning();

    if (!result[0]) {
      return {
        type: "database",
        success: false,
        message: "Internal Server Error",
      };
    }

    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err: any) {
    if (err.code === "23505" && err.detail?.includes("email")) {
      return {
        type: "database",
        success: false,
        message: "Email already in use",
      };
    }

    console.log("Error in Create User");
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
