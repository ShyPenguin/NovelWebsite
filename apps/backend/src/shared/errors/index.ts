import { capitalizeFirstLetter } from "@repo/contracts/utils/capitalizeFirstLetter";
import type { Action, Resource } from "@repo/contracts/auth/permissions";
import { aOrAn } from "../utils/a-or-an.ts";
import { mapSingularResource } from "../utils/map-singular-resource.ts";

export class BaseError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends BaseError {
  propertyName: string;

  constructor(propertyName: Resource) {
    super(
      404,
      `${capitalizeFirstLetter(mapSingularResource[propertyName])} not found`,
    );

    this.propertyName = mapSingularResource[propertyName];
  }
}

export class CustomizedNotFoundError extends BaseError {
  constructor(message: string) {
    super(404, message);
  }
}
export class DatabaseError extends BaseError {
  constructor(message = "Database error") {
    super(500, message);
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = "You're not logged in") {
    super(401, message);
  }
}

export class AuthorizationError<R extends Resource> extends BaseError {
  constructor({ action, resource }: { action: Action<R>; resource: R }) {
    super(
      403,
      `You're not allowed to ${String(action)} ${action == "create" || action == "preview" ? aOrAn({ resource }) : "this"} ${mapSingularResource[resource]}`,
    );
  }
}

export class CustomizedAuthorizationError extends BaseError {
  message: string;
  constructor(message: string) {
    super(403, message);
    this.message = message;
  }
}
export type ValidationIssue = {
  field?: string;
  message: string;
};

export class ValidationError extends BaseError {
  constructor(message = "Invalid input") {
    super(400, `${message}`);
  }
}
