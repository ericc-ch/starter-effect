# Effect RPC Migration & Hono Removal

## 1. Problem & Motivation

- **Context**: The project currently uses a hybrid of Hono (HTTP framework) and oRPC (RPC layer), alongside Effect. We want to standardize on a "Pure Effect" stack.
- **Goal**: Fully remove Hono and oRPC from `apps/api`, replacing them with `@effect/platform` (for HTTP) and `@effect/rpc` (for API).
- **Benefits**: Improved type safety, better error handling, unified dependency injection (Layers/Services), and reduced bundle size by removing redundant frameworks.

## 2. Success Criteria & End State

- **API**: Runs exclusively on `@effect/platform` HttpServer exported as a fetch handler (Cloudflare Workers compatible).
- **RPC**: All endpoints defined and handled via `@effect/rpc` (contracts and handlers in `apps/api/src/rpc/`).
- **Auth**: Better Auth routes (`/api/auth/*`) working via `@effect/platform` HTTP server.
- **CORS**: Properly configured for cross-origin requests from web app.
- **Cleanup**: Hono and oRPC dependencies removed from `apps/api/package.json`.

## 3. Scope, Constraints & Risks

- **In Scope**:
  - `apps/api`: Complete rewrite of entry point, server setup, auth integration, and CORS.
  - `apps/api/src/rpc/`: Leverage existing Effect RPC contracts and handlers.
- **Out of Scope**:
  - Frontend changes (web app stays on oRPC client for now).
  - OpenAPI/Swagger documentation.
  - Database schema changes (Drizzle).
- **Risks**:
  - Better Auth handler integration with Effect HTTP server.
  - CORS preflight and credential handling.
  - Session extraction from HTTP headers for RPC context.

## 4. High Level Implementation Strategy

- **Server**: Use `HttpServer` from `@effect/platform` with `HttpRouter` for routing.
- **Routes**:
  - `/api/auth/*` -> Forward to Better Auth's handler (it expects raw Request/Response).
  - `/rpc/*` -> Effect RPC server handler.
  - `/` -> Health check endpoint.
- **Auth Context**: HTTP middleware extracts session cookie, validates via Better Auth, and provides `CurrentUser` service to downstream handlers.
- **RPC**: Use existing `BooksRpcGroup` and `BooksHandlers` in `apps/api/src/rpc/`.

## 5. Implementation Roadmap

### Phase 1: Core Infrastructure (HTTP Server & Better Auth)

- **Goal**: Get the Effect HTTP server running with Better Auth routes working.
- **Key Deliverables**:
  - [x] **Better Auth HTTP Handler**: Create `apps/api/src/lib/auth/http.ts` that wraps Better Auth's `auth.handler(request)` for `@effect/platform` compatibility. Returns `Effect<Response, never, Auth>`.
  - [x] **CORS Middleware**: Create `apps/api/src/lib/http/cors.ts` using `HttpMiddleware.cors` from `@effect/platform` with origin from `EnvContext`.
  - [x] **Auth Session Middleware**: Create `apps/api/src/lib/auth/session.ts` that:
    - Reads `Cookie` header from `HttpServerRequest`
    - Calls `auth.api.getSession({ headers })`
    - Provides `CurrentUser` Layer (or `Option<CurrentUser>` for optional auth)
  - [x] **HTTP Router**: Create `apps/api/src/http/router.ts` that:
    - Mounts `/api/auth/*` -> Better Auth handler
    - Mounts `/rpc/*` -> RPC handler (with session middleware)
    - Mounts `/` -> Health check
  - [x] **Main Entry Point**: Create `apps/api/src/main_effect.ts` that:
    - Builds the `HttpApp` with router and middleware
    - Uses `HttpApp.toWebHandler` (or equivalent) to export a fetch handler
    - Returns `{ fetch: (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response> }` for Cloudflare Workers
    - Setup runtime with `Env`, `DB`, `Auth` layers

### Phase 2: RPC Integration

- **Goal**: Wire up existing Effect RPC handlers to the HTTP server.
- **Key Deliverables**:
  - [x] **Root RPC Group**: Create `apps/api/src/rpc/main.ts` that combines all RPC groups (currently just `BooksRpcGroup`) into a single `RpcGroup`.
  - [x] **RPC Server Layer**: Create `apps/api/src/rpc/server.ts` that:
    - Uses `RpcServer.toHttpApp()` with the root RPC group
    - Returns `Effect.Effect<HttpApp.Default, never, ...>` that can be mounted
    - Handler layers (`BooksHandlers`) will be provided at mount time
  - [x] **HTTP RPC Handler**: Wire RPC server into HTTP router at `/rpc/*` path:
    - Use `RpcServer.toHttpApp(RootRpcGroup, options)` to create HTTP app
    - Mount with `HttpRouter.mountApp("/rpc", rpcHttpApp)`
    - Provide handler layers: `rpcHttpApp.pipe(Effect.provide(BooksHandlers))`
  - [ ] **Test Endpoints**: Verify Books CRUD RPCs work via curl or similar.

### Phase 3: Switchover & Cleanup

- **Goal**: Remove Hono/oRPC and make Effect server the default.
- **Key Deliverables**:
  - [x] **Switch Entry**: Rename `apps/api/src/main_effect.ts` to `apps/api/src/main.ts`, backup old main.
  - [x] **Remove Hono**: Uninstall `hono` from `apps/api/package.json`.
  - [ ] **Remove oRPC**: Uninstall `@orpc/server`, `@orpc/openapi` from `apps/api/package.json`.
  - [ ] **Delete Legacy**: Remove:
    - `apps/api/src/app.ts`
    - `apps/api/src/procedures/`
    - `apps/api/src/lib/orpc/`
  - [ ] **Verify**: Full typecheck and test that:
    - Better Auth endpoints work (signin/signup/session)
    - RPC endpoints work (list/create/update/delete books)
    - CORS works from web origin

## 6. Key Implementation Details

### Better Auth Handler Pattern

Better Auth expects a standard Web `Request` and returns a `Response`. Use `HttpServerRequest.toWeb` to convert:

```typescript
// apps/api/src/lib/auth/http.ts
import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"
import { Auth } from "./main"

export const handleAuthRequest = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest
  const auth = yield* Auth

  // Convert HttpServerRequest back to Request for Better Auth
  const rawRequest = yield* HttpServerRequest.toWeb(request)

  // Better Auth handler returns a Promise<Response>
  const response = yield* Effect.promise(() => auth.handler(rawRequest))

  // Convert Response to HttpServerResponse
  return yield* HttpServerResponse.fromWeb(response)
})
```

**Alternative Pattern**: If Better Auth integration becomes complex, consider using `HttpApp.fromWebHandler` to wrap the auth handler as an HttpApp, then mount it with `HttpRouter.mountApp`.

### CORS Configuration

Use the built-in `HttpMiddleware.cors` from `@effect/platform`:

```typescript
// apps/api/src/lib/http/cors.ts
import { HttpMiddleware } from "@effect/platform"

export const corsMiddleware = (origin: string) =>
  HttpMiddleware.cors({
    allowedOrigins: [origin],
    credentials: true,
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
```

### RPC Route Mounting

RPC is mounted as a sub-app using `RpcServer.toHttpApp` and `HttpRouter.mountApp`:

```typescript
// apps/api/src/http/router.ts
import { HttpRouter, HttpServerResponse } from "@effect/platform"
import { RpcServer } from "@effect/rpc"
import { Effect } from "effect"
import { BooksRpcGroup } from "../rpc/contract/books"
import { BooksHandlers } from "../rpc/handlers/books"
import { handleAuthRequest } from "../lib/auth/http"

export const createRouter = Effect.gen(function* () {
  // Create RPC HttpApp from the RPC group
  const rpcHttpApp = yield* RpcServer.toHttpApp(BooksRpcGroup, {
    disableTracing: false,
    spanPrefix: "RpcServer",
  }).pipe(
    Effect.provide(BooksHandlers), // Provide the handler implementations
  )

  // Create the main router with mounted apps
  return HttpRouter.empty.pipe(
    HttpRouter.get(
      "/",
      Effect.succeed(HttpServerResponse.json({ status: "ok" })),
    ),
    HttpRouter.mountApp("/api/auth", handleAuthRequest),
    HttpRouter.mountApp("/rpc", rpcHttpApp),
  )
})
```

### Cloudflare Workers Fetch Handler Pattern

`@effect/platform` HttpServer apps can be converted to standard fetch handlers using `HttpApp.toWebHandlerLayer` or `HttpApp.toWebHandler`:

```typescript
// apps/api/src/main_effect.ts
import { HttpApp } from "@effect/platform"
import { Layer } from "effect"
import { createRouter } from "./http/router"
import { corsMiddleware } from "./lib/http/cors"
import { Database } from "./lib/db"
import { BookRepoLive } from "./rpc/services/books"

export function createApp(env: Env) {
  // Create the base layer with env and db
  const baseLayer = Layer.succeed(Database, createDB(env.DB))
  const repoLayer = BookRepoLive(env.DB)

  // Build the HttpApp
  const app = Effect.gen(function* () {
    const router = yield* createRouter
    // HttpRouter.use applies middleware to all routes in the router
    return router.pipe(HttpRouter.use(corsMiddleware(env.API_CORS_ORIGIN)))
  }).pipe(Effect.provide(repoLayer))

  // Convert to web handler with layer management
  const { handler, dispose } = HttpApp.toWebHandlerLayer(
    app,
    Layer.mergeAll(baseLayer, repoLayer),
  )

  return { handler, dispose }
}

// Cloudflare Workers default export
export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    const { handler } = createApp(env)
    return handler(request)
  },
}
```

## 7. Notes

- `packages/shared` remains unchanged - it only exports database schemas and Better Auth permissions.
- RPC contracts stay in `apps/api/src/rpc/contract/` (not moved to shared).
- Frontend migration is a future phase - for now, web app continues using existing oRPC client against the new server (may need compatibility layer or just break temporarily).
