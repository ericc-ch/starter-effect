import { Headers } from "@effect/platform"
import { Effect, Layer } from "effect"
import { beforeEach, describe, expect, it } from "vitest"
import {
  Book,
  BookRepository,
  BooksHandlers,
  BooksRpcGroup,
} from "./rpc/groups/books"
import { NotFoundError } from "./rpc/errors"

// Mock book data - reset before each test
let mockBooks: (typeof Book.Type)[] = []

const resetMockBooks = () => {
  mockBooks = [
    { id: 1, title: "Test Book 1", author: "Author 1" },
    { id: 2, title: "Test Book 2", author: "Author 2" },
  ]
}

// Create a mock BookRepository layer using Layer.succeed with instantiated service
const MockBookRepositoryLive = Layer.succeed(
  BookRepository,
  BookRepository.of({
    get: (id: number) =>
      Effect.gen(function* () {
        const book = mockBooks.find((b) => b.id === id)
        if (!book) {
          return yield* new NotFoundError({
            message: `Book with id ${id} not found`,
          })
        }
        return book
      }),

    list: Effect.succeed({ data: mockBooks }),

    create: (data: { title: string; author: string }) =>
      Effect.sync(() => {
        const newBook = {
          id: mockBooks.length + 1,
          title: data.title,
          author: data.author,
        }
        mockBooks.push(newBook)
        return newBook
      }),

    update: (
      id: number,
      data: { title?: string | undefined; author?: string | undefined },
    ) =>
      Effect.gen(function* () {
        const bookIndex = mockBooks.findIndex((b) => b.id === id)
        if (bookIndex === -1) {
          return yield* new NotFoundError({
            message: `Book with id ${id} not found`,
          })
        }
        const currentBook = mockBooks[bookIndex]!
        const updatedBook = {
          id: currentBook.id,
          title: data.title ?? currentBook.title,
          author: data.author ?? currentBook.author,
        }
        mockBooks[bookIndex] = updatedBook
        return updatedBook
      }),

    remove: (id: number) =>
      Effect.gen(function* () {
        const bookIndex = mockBooks.findIndex((b) => b.id === id)
        if (bookIndex === -1) {
          return yield* new NotFoundError({
            message: `Book with id ${id} not found`,
          })
        }
        const deletedBook = mockBooks[bookIndex]!
        mockBooks.splice(bookIndex, 1)
        return deletedBook
      }),
  }),
)

describe("Books RPC", () => {
  beforeEach(() => {
    resetMockBooks()
  })

  it("should list books", async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const handler = yield* BooksRpcGroup.accessHandler("BooksList").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepositoryLive),
        )
        return yield* handler({}, Headers.empty)
      }),
    )

    expect(result.data).toHaveLength(2)
    expect(result.data[0]!.title).toBe("Test Book 1")
  })

  it("should get a book by id", async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const handler = yield* BooksRpcGroup.accessHandler("BookGet").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepositoryLive),
        )
        return yield* handler({ id: 1 }, Headers.empty)
      }),
    )

    expect(result.id).toBe(1)
    expect(result.title).toBe("Test Book 1")
  })

  it("should create a book", async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const handler = yield* BooksRpcGroup.accessHandler("BooksCreate").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepositoryLive),
        )
        return yield* handler(
          { title: "New Book", author: "New Author" },
          Headers.empty,
        )
      }),
    )

    expect(result.title).toBe("New Book")
    expect(result.author).toBe("New Author")
    expect(result.id).toBe(3)
  })

  it("should update a book", async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const handler = yield* BooksRpcGroup.accessHandler("BooksUpdate").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepositoryLive),
        )
        return yield* handler(
          { id: 1, data: { title: "Updated Title" } },
          Headers.empty,
        )
      }),
    )

    expect(result.id).toBe(1)
    expect(result.title).toBe("Updated Title")
    expect(result.author).toBe("Author 1")
  })

  it("should delete a book", async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const handler = yield* BooksRpcGroup.accessHandler("BooksDelete").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepositoryLive),
        )
        return yield* handler({ id: 2 }, Headers.empty)
      }),
    )

    expect(result.id).toBe(2)
    expect(result.title).toBe("Test Book 2")
  })

  it("should return NotFoundError for non-existent book", async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const handler = yield* BooksRpcGroup.accessHandler("BookGet").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepositoryLive),
        )
        return yield* Effect.exit(handler({ id: 999 }, Headers.empty))
      }),
    )

    expect(result._tag).toBe("Failure")
  })
})
