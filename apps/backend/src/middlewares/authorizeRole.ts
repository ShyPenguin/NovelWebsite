import { NextFunction, Response } from "express";
import { ActionTypes, AuthRequest } from "../types/index.ts";
import { AuthorizationError } from "../utils/error.ts";
import { Resource } from "../db/index.ts";
import { UserRole } from "@repo/contracts/dto/auth";

export const authorizeRole = (
  allowedRoles: UserRole[],
  action: ActionTypes,
  resource: Resource,
): any => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new AuthorizationError({ action, resource });
    }
    next();
  };
};
