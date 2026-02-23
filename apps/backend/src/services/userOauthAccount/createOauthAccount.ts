import { ServiceResult } from "../../types/index.ts";
import { UserOAuthAccountTable } from "../../db/schemas/index.ts";
import { db } from "../../db/index.ts";

export const createUserOauthAccount = async (
  userOauthAccountData: any
): Promise<ServiceResult<typeof UserOAuthAccountTable.$inferSelect>> => {
  try {
    const result = await db
      .insert(UserOAuthAccountTable)
      .values(userOauthAccountData)
      .returning();

    if (!result[0]) {
      console.log("Error in createUserOauthAccount");

      return {
        type: "database",
        success: false,
        message: "Internal Server Error",
      };
    }

    return { success: true, data: result[0] }; // Return the newly created user
  } catch (err: any) {
    console.log("Error in createUserOauthAccount");
    return {
      success: false,
      type: "unknown",
      message: "Internal Server Error",
    };
  }
};
