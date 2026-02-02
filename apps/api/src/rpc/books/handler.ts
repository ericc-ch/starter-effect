import { eq } from "drizzle-orm"
import { Effect, Layer } from "effect"
import {
  BookId,
  BookInsert,
  books as booksTable,
  BookUpdate,
} from "shared/schema"
import { Database } from "../../lib/db"
import { NotFoundError } from "../errors"
import { BooksRpcGroup } from "./contract"

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

          return book
        }),

        list: Effect.gen(function* () {
          const data = yield* Effect.promise(() => db.select().from(booksTable))
          return { data }
        }),

        create: Effect.fn(function* (data: typeof BookInsert.Type) {
          const inserted = yield* Effect.promise(() =>
            db.insert(booksTable).values(data).returning(),
          )
          const book = inserted.at(0)!
          return book
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

          return book
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

          return book
        }),
      }
    }),
  },
) {}

export const BooksHandlers = BooksRpcGroup.toLayer({
  BookGet: (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepository
      return yield* repo.get(payload.id)
    }),

  BooksList: () =>
    Effect.gen(function* () {
      const repo = yield* BookRepository
      return yield* repo.list
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
}).pipe(Layer.provide(BookRepository.Default))
