import {
  HttpApp,
  HttpMiddleware,
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { RpcSerialization, RpcServer } from "@effect/rpc"
import { env } from "cloudflare:workers"
import { Effect, Layer, Schema } from "effect"
import { Auth } from "./lib/auth/main"
import { createDB, Database } from "./lib/db"
import { EnvContext, EnvSchema } from "./lib/env"
import { BooksHandlers, BookRepository } from "./rpc/groups/books"
import { RootRpcGroup } from "./rpc/main"

export const corsMiddleware = (origin: string) =>
  HttpMiddleware.cors({
    allowedOrigins: [origin],
    credentials: true,
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })

export const handleAuthRequest = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest
  const auth = yield* Auth

  const rawRequest = yield* HttpServerRequest.toWeb(request)
  const response = yield* Effect.promise(() => auth.handler(rawRequest))

  return yield* HttpServerResponse.fromWeb(response)
})

export const createRouter = Effect.gen(function* () {
  return HttpRouter.empty.pipe(
    HttpRouter.get("/", HttpServerResponse.json({ status: "ok" })),
    HttpRouter.mountApp("/api/auth", handleAuthRequest),
    HttpRouter.mountApp("/rpc", yield* RpcServer.toHttpApp(RootRpcGroup)),
  )
})

// Parse and validate environment
const parsedEnv = Schema.decodeUnknownSync(EnvSchema)(env)

// Create database connection
const db = createDB(env.DB)

// Create base layers (no dependencies)
const envContextLayer = Layer.succeed(EnvContext, parsedEnv)
const dbLayer = Layer.succeed(Database, db)
const rpcSerializationLayer = RpcSerialization.layerJson

// Auth layer depends on EnvContext and Database
const authLayer = Auth.Default.pipe(
  Layer.provide(envContextLayer),
  Layer.provide(dbLayer),
)

// BookRepository layer depends on Database
const bookRepoLayer = BookRepository.Default.pipe(Layer.provide(dbLayer))

// BooksHandlers layer depends on BookRepository
const booksHandlersLayer = BooksHandlers.pipe(Layer.provide(bookRepoLayer))

// Merge all layers
const appLayer = Layer.mergeAll(
  envContextLayer,
  dbLayer,
  authLayer,
  bookRepoLayer,
  booksHandlersLayer,
  rpcSerializationLayer,
)

// Build the HttpApp with router
const app = Effect.gen(function* () {
  const router = yield* createRouter
  // Convert router to HttpApp
  return yield* HttpRouter.toHttpApp(router)
}).pipe(Effect.flatten)

// Apply CORS middleware to the app
const appWithCors = corsMiddleware(parsedEnv.API_CORS_ORIGIN.toString())(app)

// Convert to web handler layer - this handles scope management internally
export default HttpApp.toWebHandlerLayer(appWithCors, appLayer)
