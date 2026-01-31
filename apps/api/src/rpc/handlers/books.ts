import { Effect } from "effect"
import {
  BooksRpcGroup,
  NotFoundError,
  ValidationError,
} from "../contract/books"
import { BookRepo } from "../services/books"

// ============================================================================
// RPC Handler Implementations
// ============================================================================

/**
 * Handler implementations for the Books RPC group.
 * Uses the BookRepo service to perform database operations.
 */
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

// Export individual handlers for testing/composition
export const GetBookHandler = (payload: { id: number }) =>
  Effect.gen(function* () {
    const repo = yield* BookRepo
    return yield* repo.getById(payload.id)
  })

export const ListBooksHandler = () =>
  Effect.gen(function* () {
    const repo = yield* BookRepo
    return yield* repo.list()
  })

export const CreateBookHandler = (payload: { title: string; author: string }) =>
  Effect.gen(function* () {
    const repo = yield* BookRepo
    return yield* repo.create(payload)
  })

export const UpdateBookHandler = (payload: {
  id: number
  data: { title?: string; author?: string }
}) =>
  Effect.gen(function* () {
    const repo = yield* BookRepo
    return yield* repo.update(payload.id, payload.data)
  })

export const DeleteBookHandler = (payload: { id: number }) =>
  Effect.gen(function* () {
    const repo = yield* BookRepo
    return yield* repo.remove(payload.id)
  })

export { NotFoundError, ValidationError }
