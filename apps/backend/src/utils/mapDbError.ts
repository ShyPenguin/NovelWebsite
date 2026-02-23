import { ServiceResult } from "../types/index.ts";

export const mapDbError = {
  // unique_violation
  "23505": {
    success: false,
    type: "conflict",
    message: "Unique constraint violation",
  },

  // foreign_key_violation
  "23503": {
    success: false,
    type: "validation",
    message: "Invalid reference",
  },

  // not_null_violation
  "23502": {
    success: false,
    type: "validation",
    message: "Missing required field",
  },

  // check_violation
  "23514": {
    success: false,
    type: "validation",
    message: "Constraint check failed",
  },

  // string_data_right_truncation
  "22001": {
    success: false,
    type: "validation",
    message: "Value too long",
  },
} as const satisfies Partial<Record<string, ServiceResult<never>>>;

type DbErrorCode = keyof typeof mapDbError;

export const getMappedDbError = (err: unknown) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as any).code === "string" &&
    (err as any).code in mapDbError
  ) {
    return mapDbError[(err as any).code as DbErrorCode];
  }

  return null;
};
