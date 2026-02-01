import { Rpc, RpcGroup } from "@effect/rpc"
import { Schema } from "effect"
import { Book, BookId, BookInsert, BookUpdate } from "../schema/books"

// Define errors using Schema.TaggedError for proper RPC serialization
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

// Define RPCs
export const GetBook = Rpc.make("books.get", {
  payload: Schema.Struct({ id: BookId }),
  success: Book,
  error: NotFoundError,
})

export const ListBooks = Rpc.make("books.list", {
  payload: Schema.Struct({}),
  success: Schema.Struct({ data: Schema.Array(Book) }),
})

export const CreateBook = Rpc.make("books.create", {
  payload: BookInsert,
  success: Book,
  error: Schema.Union(ValidationError, NotFoundError, UnauthorizedError),
})

export const UpdateBook = Rpc.make("books.update", {
  payload: Schema.Struct({ id: BookId, data: BookUpdate }),
  success: Book,
  error: Schema.Union(NotFoundError, UnauthorizedError),
})

export const DeleteBook = Rpc.make("books.delete", {
  payload: Schema.Struct({ id: BookId }),
  success: Book,
  error: Schema.Union(NotFoundError, UnauthorizedError),
})

// Group them
export const BooksRpcGroup = RpcGroup.make(
  GetBook,
  ListBooks,
  CreateBook,
  UpdateBook,
  DeleteBook,
)

// Export type for client
export type BooksRpcContract = typeof BooksRpcGroup
