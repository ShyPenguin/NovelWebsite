import { type Resource } from "../db/index.ts";
import { ActionTypes } from "../types/index.ts";
import { capitalizeFirstLetter } from "@repo/contracts/utils/capitalizeFirstLetter";

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
    super(404, `${capitalizeFirstLetter(propertyName)} not found`);

    this.propertyName = propertyName;
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
  constructor(message = "User is not logged in") {
    super(401, message);
  }
}

export class AuthorizationError extends BaseError {
  constructor({
    action,
    resource,
  }: {
    action: ActionTypes;
    resource: Resource;
  }) {
    super(
      403,
      `User is not allowed to ${action} ${action == "create" || action == "preview" ? "a" : "this"} ${resource}`,
    );
  }
}

export class CustomizedAuthorizationError extends BaseError {
  constructor(message: string) {
    super(403, message);
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
