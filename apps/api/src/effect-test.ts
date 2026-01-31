import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger,
  HttpServer,
} from "@effect/platform"
import { Rpc, RpcClient, RpcGroup, RpcServer } from "@effect/rpc"
import { Context, Effect, Layer, Schema, Schedule } from "effect"

// ============================================================================
// 1. SCHEMA DEFINITIONS (Effect Schema instead of Zod)
// ============================================================================

const BookId = Schema.Number.pipe(Schema.int(), Schema.positive())

const BookInsert = Schema.Struct({
  title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(200)),
  author: Schema.String.pipe(Schema.minLength(1)),
  publishedYear: Schema.Number.pipe(
    Schema.int(),
    Schema.greaterThan(1800),
    Schema.lessThan(2100),
  ),
})

const BookUpdate = Schema.partial(BookInsert)

const Book = Schema.Struct({
  id: BookId,
  title: Schema.String,
  author: Schema.String,
  publishedYear: Schema.Number,
  createdAt: Schema.Date,
})

const BooksList = Schema.Struct({
  data: Schema.Array(Book),
  total: Schema.Number,
})

const PaginationInput = Schema.Struct({
  page: Schema.Number.pipe(Schema.int(), Schema.positive()).pipe(
    Schema.optional,
  ),
  limit: Schema.Number.pipe(
    Schema.int(),
    Schema.positive(),
    Schema.lessThan(100),
  ).pipe(Schema.optional),
})

const UserId = Schema.UUID

const User = Schema.Struct({
  id: UserId,
  email: Schema.String,
  name: Schema.String,
  role: Schema.Literal("admin", "user", "guest"),
})

// Custom error schema
const NotFoundError = Schema.Struct({
  _tag: Schema.Literal("NotFoundError"),
  message: Schema.String,
  resource: Schema.String,
})

const ValidationError = Schema.Struct({
  _tag: Schema.Literal("ValidationError"),
  message: Schema.String,
  field: Schema.String,
})

// Type aliases for convenience
type Book = typeof Book.Type
type BookInsert = typeof BookInsert.Type
type BookUpdate = typeof BookUpdate.Type
type User = typeof User.Type
type NotFoundError = typeof NotFoundError.Type
type ValidationError = typeof ValidationError.Type

// ============================================================================
// 2. RPC DEFINITIONS
// ============================================================================

// Define individual RPC procedures
const GetBook = Rpc.make("books.get", {
  payload: Schema.Struct({ id: BookId }),
  success: Book,
  error: NotFoundError,
})

const ListBooks = Rpc.make("books.list", {
  payload: PaginationInput,
  success: BooksList,
})

const CreateBook = Rpc.make("books.create", {
  payload: BookInsert,
  success: Book,
  error: Schema.Union(ValidationError, NotFoundError),
})

const UpdateBook = Rpc.make("books.update", {
  payload: Schema.Struct({ id: BookId, data: BookUpdate }),
  success: Book,
  error: NotFoundError,
})

const DeleteBook = Rpc.make("books.delete", {
  payload: Schema.Struct({ id: BookId }),
  success: Book,
  error: NotFoundError,
})

// Group RPCs together
const BooksRpcGroup = RpcGroup.make(
  GetBook,
  ListBooks,
  CreateBook,
  UpdateBook,
  DeleteBook,
)

// Prefixed group for users
const GetUser = Rpc.make("users.get", {
  payload: Schema.Struct({ id: UserId }),
  success: User,
  error: NotFoundError,
})

const UsersRpcGroup = RpcGroup.make(GetUser)

// Merge groups
const ApiRpcGroup = BooksRpcGroup.merge(UsersRpcGroup)

// ============================================================================
// 3. SERVICE INTERFACES (Effect-style DI)
// ============================================================================

class BookRepo extends Context.Tag("BookRepo")<
  BookRepo,
  {
    findById: (id: number) => Effect.Effect<Book | null, never>
    findAll: (pagination: {
      page: number
      limit: number
    }) => Effect.Effect<{ data: Book[]; total: number }, never>
    create: (data: BookInsert) => Effect.Effect<Book, ValidationError>
    update: (id: number, data: BookUpdate) => Effect.Effect<Book, NotFoundError>
    delete: (id: number) => Effect.Effect<Book, NotFoundError>
  }
>() {}

class UserRepo extends Context.Tag("UserRepo")<
  UserRepo,
  {
    findById: (id: string) => Effect.Effect<User | null, never>
  }
>() {}

// Custom auth context tag
class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, User>() {}

// ============================================================================
// 4. RPC HANDLER IMPLEMENTATIONS
// ============================================================================

// Handler functions receive payload as first argument, options as second
const BookHandlers = BooksRpcGroup.toLayer({
  "books.get": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      const book = yield* repo.findById(payload.id)

      if (!book) {
        return yield* Effect.fail({
          _tag: "NotFoundError" as const,
          message: `Book with id ${payload.id} not found`,
          resource: "book",
        })
      }

      return book
    }),

  "books.list": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      const page = payload.page ?? 1
      const limit = payload.limit ?? 20

      return yield* repo.findAll({ page, limit })
    }),

  "books.create": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      const currentUser = yield* CurrentUser

      yield* Effect.logInfo(`User ${currentUser.name} is creating a book`)

      return yield* repo.create(payload)
    }),

  "books.update": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      const currentUser = yield* CurrentUser

      yield* Effect.logInfo(
        `User ${currentUser.name} is updating book ${payload.id}`,
      )

      return yield* repo.update(payload.id, payload.data)
    }),

  "books.delete": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      const currentUser = yield* CurrentUser

      yield* Effect.logInfo(
        `User ${currentUser.name} is deleting book ${payload.id}`,
      )

      return yield* repo.delete(payload.id)
    }),
})

const UserHandlers = UsersRpcGroup.toLayer({
  "users.get": (payload) =>
    Effect.gen(function* () {
      const repo = yield* UserRepo
      const user = yield* repo.findById(payload.id)

      if (!user) {
        return yield* Effect.fail({
          _tag: "NotFoundError" as const,
          message: `User with id ${payload.id} not found`,
          resource: "user",
        })
      }

      return user
    }),
})

const AllHandlers = Layer.merge(BookHandlers, UserHandlers)

// ============================================================================
// 5. HTTP API DEFINITIONS (OpenAPI-compatible)
// ============================================================================

const BooksGroup = HttpApiGroup.make("Books")
  .add(
    HttpApiEndpoint.get("getBook")`/books/${BookId}`
      .addSuccess(Book)
      .addError(NotFoundError),
  )
  .add(HttpApiEndpoint.get("listBooks")`/books`.addSuccess(BooksList))
  .add(
    HttpApiEndpoint.post("createBook")`/books`
      .addSuccess(Book)
      .addError(ValidationError),
  )
  .add(
    HttpApiEndpoint.patch("updateBook")`/books/${BookId}`
      .addSuccess(Book)
      .addError(NotFoundError),
  )
  .add(
    HttpApiEndpoint.del("deleteBook")`/books/${BookId}`
      .addSuccess(Book)
      .addError(NotFoundError),
  )

const UsersGroup = HttpApiGroup.make("Users").add(
  HttpApiEndpoint.get("getUser")`/users/${UserId}`
    .addSuccess(User)
    .addError(NotFoundError),
)

const Api = HttpApi.make("LibraryAPI").add(BooksGroup).add(UsersGroup)

// ============================================================================
// 6. HTTP API IMPLEMENTATION
// ============================================================================

const BooksLive = HttpApiBuilder.group(Api, "Books", (handlers) =>
  handlers
    .handle("getBook", (req) =>
      Effect.gen(function* () {
        const repo = yield* BookRepo
        // Access path parameter from req.path which is a tuple
        const id = (req.path as unknown as { readonly 0: number })[0]
        const book = yield* repo.findById(id)

        if (!book) {
          return yield* Effect.fail({
            _tag: "NotFoundError" as const,
            message: `Book not found`,
            resource: "book",
          })
        }

        return book
      }),
    )
    .handle("listBooks", () =>
      Effect.gen(function* () {
        const repo = yield* BookRepo
        return yield* repo.findAll({ page: 1, limit: 20 })
      }),
    )
    .handle("createBook", () =>
      Effect.gen(function* () {
        const repo = yield* BookRepo
        // In real implementation, get body from request
        const book = yield* repo.create({
          title: "New Book",
          author: "Author",
          publishedYear: 2024,
        })
        return book
      }),
    )
    .handle("updateBook", (req) =>
      Effect.gen(function* () {
        const repo = yield* BookRepo
        const id = (req.path as unknown as { readonly 0: number })[0]
        const book = yield* repo.update(id, {
          title: "Updated Book",
        })
        return book
      }),
    )
    .handle("deleteBook", (req) =>
      Effect.gen(function* () {
        const repo = yield* BookRepo
        const id = (req.path as unknown as { readonly 0: number })[0]
        const book = yield* repo.delete(id)
        return book
      }),
    ),
)

const ApiLive = HttpApiBuilder.api(Api).pipe(Layer.provide(BooksLive))

// ============================================================================
// 7. RPC SERVER SETUP
// ============================================================================

// HTTP transport for RPC
const RpcHttpLayer = RpcServer.layerHttpRouter({
  group: ApiRpcGroup,
  path: "/rpc",
  protocol: "http",
}).pipe(Layer.provide(AllHandlers))

// ============================================================================
// 8. HTTP SERVER SETUP
// ============================================================================

// Full API server with Swagger - using a config tag
const ApiConfigLive = Layer.succeed(HttpServer.HttpServer, {
  address: { port: 3000 },
} as unknown as HttpServer.HttpServer)

const ApiServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(ApiLive),
  Layer.provide(ApiConfigLive),
)

// ============================================================================
// 9. CLIENT USAGE
// ============================================================================

// RPC Client example
const RpcClientProgram = Effect.gen(function* () {
  const client = yield* RpcClient.make(ApiRpcGroup)

  // Call RPC methods
  const book = yield* client.books.get({ id: 1 })
  const books = yield* client.books.list({ page: 1, limit: 10 })

  // With custom headers
  yield* RpcClient.withHeaders({ "X-Custom-Header": "value" })(
    client.books.get({ id: 1 }),
  )

  return { book, books }
})

// ============================================================================
// 10. SERVICE IMPLEMENTATIONS
// ============================================================================

// Mock implementations
const MockBookRepoLive = Layer.succeed(
  BookRepo,
  BookRepo.of({
    findById: (id) =>
      Effect.succeed({
        id,
        title: "Mock Book",
        author: "Mock Author",
        publishedYear: 2024,
        createdAt: new Date(),
      }),
    findAll: () =>
      Effect.succeed({
        data: [],
        total: 0,
      }),
    create: (data) =>
      Effect.succeed({
        id: 1,
        ...data,
        createdAt: new Date(),
      }),
    update: (id, data) =>
      Effect.succeed({
        id,
        title: data.title ?? "Updated",
        author: data.author ?? "Author",
        publishedYear: data.publishedYear ?? 2024,
        createdAt: new Date(),
      }),
    delete: (id) =>
      Effect.succeed({
        id,
        title: "Deleted",
        author: "Deleted",
        publishedYear: 2024,
        createdAt: new Date(),
      }),
  }),
)

const MockUserRepoLive = Layer.succeed(
  UserRepo,
  UserRepo.of({
    findById: (id) =>
      Effect.succeed({
        id,
        email: "user@example.com",
        name: "Test User",
        role: "user",
      }),
  }),
)

const MockCurrentUserLive = Layer.succeed(CurrentUser, {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
})

// ============================================================================
// 11. RUNNING THE APPLICATION
// ============================================================================

// Compose all layers
const AppLayer = Layer.mergeAll(
  MockBookRepoLive,
  MockUserRepoLive,
  MockCurrentUserLive,
  AllHandlers,
  RpcHttpLayer,
)

// Main entry point
const MainLive = Layer.mergeAll(ApiServerLive, AppLayer)

// ============================================================================
// 12. UTILITY FUNCTIONS & PATTERNS
// ============================================================================

// Retry pattern using schedule
const retrySchedule = Effect.retry(
  Effect.gen(function* () {
    yield* Effect.logInfo("Attempting operation...")
    return yield* Effect.succeed("success")
  }),
  Schedule.addDelay(Schedule.recurs(3), () => 1000),
)

// Circuit breaker pattern
const circuitBreaker = Effect.acquireUseRelease(
  Effect.succeed("resource"),
  (resource) => Effect.succeed(`Using ${resource}`),
  (resource) => Effect.logInfo(`Releasing ${resource}`),
)

// Parallel operations
const parallelBooks = Effect.forEach(
  [1, 2, 3, 4, 5],
  (id) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      return yield* repo.findById(id)
    }),
  { concurrency: 5 },
)

// Error handling with match
const handledOperation = Effect.match(
  Effect.gen(function* () {
    const repo = yield* BookRepo
    const book = yield* repo.findById(999)
    if (!book) {
      return yield* Effect.fail(new Error("Not found"))
    }
    return book
  }),
  {
    onFailure: (error) => ({ success: false as const, error: error.message }),
    onSuccess: (book) => ({ success: true as const, data: book }),
  },
)

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Schemas
  Book,
  BookInsert,
  BookUpdate,
  BookId,
  BooksList,
  User,
  UserId,
  NotFoundError,
  ValidationError,
  // RPC
  BooksRpcGroup,
  UsersRpcGroup,
  ApiRpcGroup,
  GetBook,
  ListBooks,
  CreateBook,
  // Services
  BookRepo,
  UserRepo,
  CurrentUser,
  // Layers
  BookHandlers,
  AllHandlers,
  AppLayer,
  MockBookRepoLive,
  MockUserRepoLive,
  // Server
  MainLive,
  // HTTP API
  Api,
  BooksGroup,
  ApiLive,
  // Utils
  RpcClientProgram,
  parallelBooks,
  handledOperation,
  // Runners
  retrySchedule,
  circuitBreaker,
}
