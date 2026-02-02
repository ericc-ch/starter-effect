import { Rpc, RpcGroup } from "@effect/rpc"
import { Effect, Schema } from "effect"
import { eq } from "drizzle-orm"
import { books as booksTable } from "shared/schema"
import { Database } from "../lib/db"
import { NotFoundError, ValidationError, UnauthorizedError } from "./errors"

export class Book extends Schema.Class<Book>("Book")({
  id: Schema.Number.pipe(Schema.int(), Schema.positive()),
  title: Schema.String,
  author: Schema.String,
}) {}

export const BookInsert = Schema.Struct(Book.fields).pipe(Schema.omit("id"))
export const BookUpdate = Schema.partial(BookInsert)
export const BookId = Schema.Number.pipe(Schema.int(), Schema.positive())

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

export const BooksRpcGroup = RpcGroup.make(
  GetBook,
  ListBooks,
  CreateBook,
  UpdateBook,
  DeleteBook,
)

export type BooksRpcContract = typeof BooksRpcGroup

export class BookRepo extends Effect.Service<BookRepo>()("features/BookRepo", {
  effect: Effect.gen(function* () {
    const db = yield* Database

    return {
      getById: (id: typeof BookId.Type) =>
        Effect.gen(function* () {
          const data = yield* Effect.tryPromise({
            try: () =>
              db
                .select()
                .from(booksTable)
                .where(eq(booksTable.id, id))
                .limit(1),
            catch: () => new NotFoundError({ message: "Database error" }),
          })
          const book = data.at(0)
          if (!book) {
            return yield* new NotFoundError({
              message: `Book with id ${id} not found`,
            })
          }
          return book as typeof Book.Type
        }),

      list: () =>
        Effect.gen(function* () {
          const data = yield* Effect.tryPromise({
            try: () => db.select().from(booksTable),
            catch: () => new Error("Database error"),
          })
          return { data: data as ReadonlyArray<typeof Book.Type> }
        }).pipe(Effect.orDie),

      create: (data: typeof BookInsert.Type) =>
        Effect.gen(function* () {
          const inserted = yield* Effect.tryPromise({
            try: () => db.insert(booksTable).values(data).returning(),
            catch: () =>
              new NotFoundError({ message: "Failed to create book" }),
          })
          const book = inserted.at(0)
          if (!book) {
            return yield* new NotFoundError({
              message: "Failed to create book",
            })
          }
          return book as typeof Book.Type
        }),

      update: (id: typeof BookId.Type, data: typeof BookUpdate.Type) =>
        Effect.gen(function* () {
          const updated = yield* Effect.tryPromise({
            try: () =>
              db
                .update(booksTable)
                .set(data)
                .where(eq(booksTable.id, id))
                .returning()
                .limit(1),
            catch: () => new NotFoundError({ message: "Database error" }),
          })
          const book = updated.at(0)
          if (!book) {
            return yield* new NotFoundError({
              message: `Book with id ${id} not found`,
            })
          }
          return book as typeof Book.Type
        }),

      remove: (id: typeof BookId.Type) =>
        Effect.gen(function* () {
          const deleted = yield* Effect.tryPromise({
            try: () =>
              db
                .delete(booksTable)
                .where(eq(booksTable.id, id))
                .returning()
                .limit(1),
            catch: () => new NotFoundError({ message: "Database error" }),
          })
          const book = deleted.at(0)
          if (!book) {
            return yield* new NotFoundError({
              message: `Book with id ${id} not found`,
            })
          }
          return book as typeof Book.Type
        }),
    }
  }),
}) {}

export const BooksHandlers = BooksRpcGroup.toLayer({
  "books.get": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      return yield* repo.getById(payload.id)
    }),

  "books.list": () =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      return yield* repo.list()
    }),

  "books.create": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      return yield* repo.create(payload)
    }),

  "books.update": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      return yield* repo.update(payload.id, payload.data)
    }),

  "books.delete": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      return yield* repo.remove(payload.id)
    }),
})
