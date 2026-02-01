import { Headers } from "@effect/platform"
import { Effect, Layer } from "effect"
import { beforeEach, describe, expect, it } from "vitest"
import { BooksRpcGroup, NotFoundError } from "./rpc/contract/books"
import { BooksHandlers } from "./rpc/handlers/books"
import { BookRepo } from "./rpc/services/books"
import type { BookType, BookUpdateType } from "./rpc/schema/books"

// Mock book data - reset before each test
let mockBooks: BookType[] = []

const resetMockBooks = () => {
  mockBooks = [
    { id: 1, title: "Test Book 1", author: "Author 1" },
    { id: 2, title: "Test Book 2", author: "Author 2" },
  ]
}

// Create a mock BookRepo layer
const MockBookRepoLive = Layer.succeed(BookRepo, {
  getById: (id: number) =>
    Effect.gen(function* () {
      const book = mockBooks.find((b) => b.id === id)
      if (!book) {
        return yield* new NotFoundError({
          message: `Book with id ${id} not found`,
        })
      }
      return book
    }),

  list: () => Effect.succeed({ data: mockBooks }),

  create: (data: { title: string; author: string }) =>
    Effect.sync(() => {
      const newBook: BookType = {
        id: mockBooks.length + 1,
        title: data.title,
        author: data.author,
      }
      mockBooks.push(newBook)
      return newBook
    }),

  update: (id: number, data: BookUpdateType) =>
    Effect.gen(function* () {
      const bookIndex = mockBooks.findIndex((b) => b.id === id)
      if (bookIndex === -1) {
        return yield* new NotFoundError({
          message: `Book with id ${id} not found`,
        })
      }
      const currentBook = mockBooks[bookIndex]!
      const updatedBook: BookType = {
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
})

describe("Books RPC", () => {
  beforeEach(() => {
    resetMockBooks()
  })

  it("should list books", async () => {
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const handler = yield* BooksRpcGroup.accessHandler("books.list").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepoLive),
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
        const handler = yield* BooksRpcGroup.accessHandler("books.get").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepoLive),
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
        const handler = yield* BooksRpcGroup.accessHandler("books.create").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepoLive),
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
        const handler = yield* BooksRpcGroup.accessHandler("books.update").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepoLive),
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
        const handler = yield* BooksRpcGroup.accessHandler("books.delete").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepoLive),
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
        const handler = yield* BooksRpcGroup.accessHandler("books.get").pipe(
          Effect.provide(BooksHandlers),
          Effect.provide(MockBookRepoLive),
        )
        return yield* Effect.exit(handler({ id: 999 }, Headers.empty))
      }),
    )

    expect(result._tag).toBe("Failure")
  })
})
