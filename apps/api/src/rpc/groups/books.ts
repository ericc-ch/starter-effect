import { Rpc, RpcGroup } from "@effect/rpc"
import { Effect, Match, ParseResult, pipe, Schema } from "effect"
import { eq } from "drizzle-orm"
import {
  Book,
  BookId,
  BookInsert,
  BookUpdate,
  books as booksTable,
} from "shared/schema"
import { NotFoundError, ValidationError, UnauthorizedError } from "../errors"
import { Database } from "../../lib/db"

export class BooksRpcGroup extends RpcGroup.make(
  Rpc.make("BookGet", {
    payload: Schema.Struct({ id: BookId }),
    success: Book,
    error: Schema.Union(NotFoundError, ValidationError),
  }),
  Rpc.make("BooksList", {
    payload: Schema.Struct({}),
    success: Schema.Struct({ data: Schema.Array(Book) }),
  }),
  Rpc.make("BooksCreate", {
    payload: BookInsert,
    success: Book,
    error: Schema.Union(ValidationError, NotFoundError, UnauthorizedError),
  }),
  Rpc.make("BooksUpdate", {
    payload: Schema.Struct({ id: BookId, data: BookUpdate }),
    success: Book,
    error: Schema.Union(NotFoundError, UnauthorizedError),
  }),
  Rpc.make("BooksDelete", {
    payload: Schema.Struct({ id: BookId }),
    success: Book,
    error: Schema.Union(NotFoundError, UnauthorizedError),
  }),
) {}

export class BookRepository extends Effect.Service<BookRepository>()(
  "api/rpc/groups/books/BookRepository",
  {
    effect: Effect.gen(function* () {
      const db = yield* Database

      return {
        get: Effect.fn(function* (id: typeof BookId.Type) {
          const data = yield* Effect.promise(() =>
            db.select().from(booksTable).where(eq(booksTable.id, id)).limit(1),
          )

          const book = data.at(0)
          if (!book)
            return yield* new NotFoundError({
              message: `Book with id ${id} not found`,
            })

          return yield* pipe(book, Schema.decodeUnknown(Book))
        }),

        list: Effect.gen(function* () {
          const data = yield* Effect.promise(() => db.select().from(booksTable))
          return { data: yield* Schema.decodeUnknown(Schema.Array(Book))(data) }
        }),

        create: Effect.fn(function* (data: typeof BookInsert.Type) {
          const inserted = yield* Effect.promise(() =>
            db.insert(booksTable).values(data).returning(),
          )
          const book = inserted.at(0)
          if (!book) {
            return yield* new NotFoundError({
              message: "Failed to create book",
            })
          }
          return yield* Schema.decodeUnknown(Book)(book)
        }),

        update: Effect.fn(function* (
          id: typeof BookId.Type,
          data: typeof BookUpdate.Type,
        ) {
          const updated = yield* Effect.promise(() =>
            db
              .update(booksTable)
              .set(data)
              .where(eq(booksTable.id, id))
              .returning()
              .limit(1),
          )
          const book = updated.at(0)
          if (!book) {
            return yield* new NotFoundError({
              message: `Book with id ${id} not found`,
            })
          }
          return yield* Schema.decodeUnknown(Book)(book)
        }),

        remove: Effect.fn(function* (id: typeof BookId.Type) {
          const deleted = yield* Effect.promise(() =>
            db
              .delete(booksTable)
              .where(eq(booksTable.id, id))
              .returning()
              .limit(1),
          )
          const book = deleted.at(0)
          if (!book) {
            return yield* new NotFoundError({
              message: `Book with id ${id} not found`,
            })
          }
          return yield* Schema.decodeUnknown(Book)(book)
        }),
      }
    }),
  },
) {}

export const BooksHandlers = BooksRpcGroup.toLayer({
  BookGet: (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepository
      return yield* repo.get(payload.id).pipe(
        Effect.catchTag(
          "ParseError",
          (err) =>
            new ValidationError({
              message: err.message,
              cause: err,
            }),
        ),
      )
    }),

  BooksList: () =>
    Effect.gen(function* () {
      const repo = yield* BookRepository
      return yield* repo.list()
    }),

  BooksCreate: (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepository
      return yield* repo.create(payload)
    }),

  BooksUpdate: (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepository
      return yield* repo.update(payload.id, payload.data)
    }),

  BooksDelete: (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepository
      return yield* repo.remove(payload.id)
    }),
})
