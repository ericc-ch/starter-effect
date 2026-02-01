import { eq } from "drizzle-orm"
import { Effect, Context, Layer } from "effect"
import { books as booksTable } from "shared/schema"
import type {
  BookType,
  BookInsertType,
  BookUpdateType,
  BookIdType,
} from "../schema/books"
import { NotFoundError, ValidationError } from "../contract/books"
import type { GenericSQLite } from "../../lib/db"

// Domain errors
export { NotFoundError, ValidationError }

// BookRepo service interface
export interface BookRepoService {
  readonly getById: (
    id: BookIdType,
  ) => Effect.Effect<BookType, NotFoundError, never>
  readonly list: () => Effect.Effect<{ data: BookType[] }, never, never>
  readonly create: (
    data: BookInsertType,
  ) => Effect.Effect<BookType, ValidationError | NotFoundError, never>
  readonly update: (
    id: BookIdType,
    data: BookUpdateType,
  ) => Effect.Effect<BookType, NotFoundError, never>
  readonly remove: (
    id: BookIdType,
  ) => Effect.Effect<BookType, NotFoundError, never>
}

// BookRepo Context.Tag - using the proper Effect pattern
export class BookRepo extends Context.Tag("BookRepo")<
  BookRepo,
  BookRepoService
>() {}

// Helper to wrap DB operations in Effect
const tryDrizzle = <T>(
  operation: () => Promise<T>,
): Effect.Effect<T, never, never> =>
  Effect.tryPromise({
    try: operation,
    catch: () => new NotFoundError({ message: "Database error" }) as never,
  }) as Effect.Effect<T, never, never>

// BookRepoLive Layer
export const BookRepoLive = (
  db: GenericSQLite,
): Layer.Layer<BookRepo, never, never> =>
  Layer.succeed(BookRepo, {
    getById: (id) =>
      Effect.gen(function* () {
        const data = yield* tryDrizzle(() =>
          db.select().from(booksTable).where(eq(booksTable.id, id)).limit(1),
        )
        const book = data.at(0)
        if (!book) {
          return yield* new NotFoundError({
            message: `Book with id ${id} not found`,
          })
        }
        return book as BookType
      }),

    list: () =>
      Effect.gen(function* () {
        const data = yield* tryDrizzle(() => db.select().from(booksTable))
        return { data: data as BookType[] }
      }),

    create: (data) =>
      Effect.gen(function* () {
        const inserted = yield* tryDrizzle(() =>
          db.insert(booksTable).values(data).returning(),
        )
        const book = inserted.at(0)
        if (!book) {
          return yield* new NotFoundError({ message: "Failed to create book" })
        }
        return book as BookType
      }),

    update: (id, data) =>
      Effect.gen(function* () {
        const updated = yield* tryDrizzle(() =>
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
        return book as BookType
      }),

    remove: (id) =>
      Effect.gen(function* () {
        const deleted = yield* tryDrizzle(() =>
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
        return book as BookType
      }),
  })
