import { ValidationError } from "@/shared/errors/index.ts";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validateMiddleware<T>(
  schema: z.ZodSchema<T>,
  type: "params" | "body" | "query",
): any {
  return (req: Request, res: Response, next: NextFunction): any => {
    const { data, success, error } = schema.safeParse(req[type]);

    if (!success) {
      const flattened = z.flattenError(error);
      // Check form-level errors first (e.g., strict mode, refinements)
      if (flattened.formErrors.length > 0) {
        throw new ValidationError(flattened.formErrors[0]);
      }

      const fieldErrors = flattened.fieldErrors;

      // Get the first field with an error
      const firstErrorField = Object.keys(
        fieldErrors,
      )[0] as keyof typeof fieldErrors;

      // Get the first error message for that field
      const message = fieldErrors[firstErrorField]?.[0] || "Invalid input";
      throw new ValidationError(message);
    }

    req[type] = data;
    next();
  };
}
