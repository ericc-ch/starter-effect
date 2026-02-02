import { Schema } from "effect"

export class NotFoundError extends Schema.TaggedError<NotFoundError>(
  "NotFoundError",
)("NotFoundError", { message: Schema.String }) {}

export class ValidationError extends Schema.TaggedError<ValidationError>(
  "ValidationError",
)("ValidationError", { message: Schema.String, field: Schema.String }) {}

export class UnauthorizedError extends Schema.TaggedError<UnauthorizedError>(
  "UnauthorizedError",
)("UnauthorizedError", { message: Schema.String }) {}

export class ForbiddenError extends Schema.TaggedError<ForbiddenError>(
  "ForbiddenError",
)("ForbiddenError", { message: Schema.String }) {}
