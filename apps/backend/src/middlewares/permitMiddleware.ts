import { NextFunction, Response } from "express";
import { ActionTypes, AuthRequest, ServiceResult } from "../types/index.ts";
import { UserRole } from "../db/schemas/index.ts";

type PermitMiddleWareType<T> = {
  method: ActionTypes;
  resource: string;
  fetchResource: ({ id }: { id: string }) => Promise<T>;
  ownershipField: keyof T;
  allowedRolesToSkip: UserRole[];
  ownershipField2?: keyof T;
};
export function permitMiddleware<T>({
  method,
  resource,
  fetchResource,
  ownershipField,
  allowedRolesToSkip,
  ownershipField2,
}: PermitMiddleWareType<T>) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    if (!req.user) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (allowedRolesToSkip.includes(req.user.role)) {
      return next();
    }

    const result = await fetchResource({
      id: Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    });

    if (!result.success) {
      return res.status(result.type === "unknown" ? 500 : 404).json({
        type: result.type,
        message: result.message,
      });
    }

    if (ownershipField2) {
      if (
        result.data[ownershipField] !== req.user.id &&
        result.data[ownershipField2] !== req.user.id
      ) {
        return res.status(403).json({
          message: `You're not allowed to ${method} this ${resource}`,
        });
      }
    } else {
      if (result.data[ownershipField] !== req.user.id) {
        return res.status(403).json({
          message: `You're not allowed to ${method} this ${resource}`,
        });
      }
    }

    // Ownership validated; proceed
    next();
  };
}
