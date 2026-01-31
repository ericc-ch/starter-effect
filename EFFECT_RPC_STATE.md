# Effect RPC Migration - Current State

## Date: 2026-01-31

## Status: Phase 4 Complete, Ready for Phase 5

---

## ✅ COMPLETED WORK

### Phase 1: Effect RPC Schema (`apps/api/src/rpc/schema/books.ts`)

```typescript
- Book class extends Schema.Class (id, title, author)
- BookInsert = Schema.Struct(Book.fields).pipe(Schema.omit("id"))
- BookUpdate = Schema.partial(BookInsert)
- BookId = Schema.Number.pipe(Schema.int(), Schema.positive())
- Types: BookType, BookInsertType, BookUpdateType, BookIdType
```

### Phase 2: Effect RPC Contract (`apps/api/src/rpc/contract/books.ts`)

```typescript
- NotFoundError extends Schema.TaggedError("NotFoundError")
- ValidationError extends Schema.TaggedError("ValidationError")
- 5 RPCs defined:
  - GetBook: payload { id }, success Book, error NotFoundError
  - ListBooks: payload {}, success { data: Book[] }
  - CreateBook: payload BookInsert, success Book, error ValidationError | NotFoundError
  - UpdateBook: payload { id, data }, success Book, error NotFoundError
  - DeleteBook: payload { id }, success Book, error NotFoundError
- BooksRpcGroup = RpcGroup.make(...all RPCs)
- BooksRpcContract type exported
```

### Phase 3: Service Layer (`apps/api/src/rpc/services/books.ts`)

```typescript
- BookRepoService interface with 5 methods
- BookRepo extends Context.Tag("BookRepo")<BookRepo, BookRepoService>
- BookRepoLive Layer factory that takes DB
- Methods implemented with Effect.gen and Effect.tryPromise
- Returns NotFoundError for missing books
- Uses Drizzle ORM (eq, db.select/insert/update/delete)
```

### Phase 4: RPC Handlers (`apps/api/src/rpc/handlers/books.ts`)

```typescript
- BooksHandlers = BooksRpcGroup.toLayer({
    "books.get": (payload) => Effect.gen...
    "books.list": () => Effect.gen...
    "books.create": (payload) => Effect.gen...
    "books.update": (payload) => Effect.gen...
    "books.delete": (payload) => Effect.gen...
  })
- All handlers use BookRepo service via yield* BookRepo
- Individual handlers exported for testing
```

### Runtime System (`apps/api/src/lib/runtime.ts`)

```typescript
- D1Live: Creates @effect/sql-d1 layer from D1Database binding
- EnvLive: Parses and provides env config
- BindingsLive: Provides Cloudflare bindings
- buildLayer: Merges all layers
- createRuntime: Creates ManagedRuntime for executing Effects
```

---

## 📁 FILE STRUCTURE

```
apps/api/src/
├── rpc/
│   ├── schema/
│   │   └── books.ts          ✅ Book schema definitions
│   ├── contract/
│   │   └── books.ts          ✅ RPC contract + errors
│   ├── services/
│   │   └── books.ts          ✅ BookRepo service
│   └── handlers/
│       └── books.ts          ✅ RPC handler implementations
├── lib/
│   ├── runtime.ts            ✅ Effect runtime with D1
│   ├── env.ts                ✅ Env parsing (unchanged)
│   ├── db.ts                 ✅ Drizzle DB (unchanged)
│   └── services.ts           ✅ Old services (to be replaced)
├── procedures/               📝 Old oRPC (to be replaced)
│   ├── books.ts
│   └── main.ts
└── main.ts                   📝 Entry point (to be updated)

packages/shared/src/
├── schema/
│   ├── books.sql.ts          ✅ Drizzle schema
│   └── main.ts
└── contract/
    └── books.ts              ✅ oRPC contract (will be replaced)
```

---

## 🎯 PENDING PHASES

### Phase 5: Auth Middleware for Effect RPC

**Goal:** Implement authentication/authorization for RPC calls

**Approach Options:**

1. Use RpcMiddleware pattern from @effect/rpc
2. Create CurrentUser Context.Tag
3. Access Better Auth from within handlers

**Key Questions:**

- How to access request headers/cookies in RPC handlers?
- How to integrate with existing Better Auth setup?
- Should auth be per-RPC or global middleware?

**References:**

- `apps/api/src/lib/auth.ts` - Better Auth setup
- `apps/api/src/lib/orpc/middleware.ts` - Current oRPC auth middleware
- Effect RPC docs: RpcMiddleware pattern

### Phase 6: Effect RPC Server Setup

**Goal:** Replace oRPC with Effect RPC server

**Tasks:**

1. Create RpcServer with HTTP transport
2. Wire up BooksHandlers layer
3. Mount server in Hono app
4. Handle CORS, errors, etc.

**Key Code Pattern:**

```typescript
import { RpcServer } from "@effect/rpc"

const RpcLayer = RpcServer.layer({
  group: BooksRpcGroup,
  path: "/rpc",
}).pipe(Layer.provide(BooksHandlers))
```

### Phase 7: Effect RPC Client

**Goal:** Create client for web app

**Tasks:**

1. Export shared contract from packages/shared
2. Create RpcClient in apps/web
3. Replace current API calls

### Phase 8: Export Combined Contract

**Goal:** Create unified contract export

**Tasks:**

1. Merge all RPC groups into single ApiRpcGroup
2. Export types for client consumption
3. Update shared package exports

---

## 🔧 PATTERNS ESTABLISHED

### Error Handling

```typescript
// Use Schema.TaggedError for RPC-serializable errors
export class NotFoundError extends Schema.TaggedError<NotFoundError>(
  "NotFoundError",
)("NotFoundError", { message: Schema.String }) {}
```

### Service Pattern

```typescript
// Context.Tag for dependency injection
export class BookRepo extends Context.Tag("BookRepo")<
  BookRepo,
  BookRepoService
>() {}

// Layer factory pattern
export const BookRepoLive = (db: DB): Layer.Layer<BookRepo, never, never> =>
  Layer.succeed(BookRepo, { ...implementation })
```

### Handler Pattern

```typescript
// RpcGroup.toLayer with handler implementations
export const BooksHandlers = BooksRpcGroup.toLayer({
  "books.get": (payload) =>
    Effect.gen(function* () {
      const repo = yield* BookRepo
      return yield* repo.getById(payload.id)
    }),
})
```

### Database Integration

```typescript
// Using @effect/sql-d1
export const D1Live = (d1: D1Database) => D1.D1Client.layer({ db: d1 })
```

---

## 🚨 KNOWN ISSUES / DECISIONS NEEDED

1. **D1Client vs Drizzle:** Currently using Drizzle ORM in BookRepo, but @effect/sql-d1 is set up in runtime. Decide:
   - Keep Drizzle (simpler, existing schema)
   - Migrate to @effect/sql-d1 (more Effect-native)

2. **Auth Integration:** Need to decide how to pass auth context from HTTP layer to RPC handlers. Options:
   - RpcMiddleware with headers access
   - Provide CurrentUser as layer dependency
   - Pass auth token in every RPC payload

3. **Type Exports:** Currently not exporting everything from shared package. Need clean exports for client.

---

## 📚 REFERENCES

### Existing Effect Examples

- `apps/api/src/effect-test.ts` - Comprehensive Effect RPC examples with patterns

### Documentation

- Effect RPC: https://effect.website/docs/rpc
- @effect/sql-d1: Part of @effect/sql package

### Old Code (for reference)

- `apps/api/src/procedures/books.ts` - oRPC book procedures
- `apps/api/src/lib/orpc/middleware.ts` - Auth middleware pattern
- `apps/api/src/lib/auth.ts` - Better Auth configuration

---

## 🎬 NEXT STEPS

**Immediate (Phase 5):**

1. Study RpcMiddleware pattern from effect-test.ts
2. Create auth middleware that accesses Better Auth
3. Apply middleware to BooksRpcGroup or individual RPCs
4. Test auth flow

**Then (Phase 6):**

1. Set up RpcServer with HTTP transport
2. Integrate with Hono app
3. Test end-to-end

**Later (Phases 7-8):**

1. Create client
2. Migrate web app
3. Clean up old oRPC code

---

## 💻 TYPECHECK STATUS

```bash
cd /home/erick/Documents/projects/starter-effect
pnpm run typecheck

# Current: All Effect RPC files pass typecheck
# Remaining errors are in old oRPC procedures (to be replaced)
```

---

## 🔗 RELATED FILES

- Runtime: `apps/api/src/lib/runtime.ts`
- Schema: `apps/api/src/rpc/schema/books.ts`
- Contract: `apps/api/src/rpc/contract/books.ts`
- Services: `apps/api/src/rpc/services/books.ts`
- Handlers: `apps/api/src/rpc/handlers/books.ts`
- Effect Examples: `apps/api/src/effect-test.ts`
