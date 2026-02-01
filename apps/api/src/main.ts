import { HttpApp, HttpRouter } from "@effect/platform"
import { RpcSerialization } from "@effect/rpc"
import { Effect, Layer, Schema } from "effect"
import { createRouter } from "./http/router"
import { corsMiddleware } from "./lib/http/cors"
import { createDB, Database } from "./lib/db"
import { EnvContext, EnvSchema } from "./lib/env"
import { Auth } from "./lib/auth/main"
import { BookRepoLive } from "./rpc/services/books"
import { BooksHandlers } from "./rpc/handlers/books"

/**
 * Creates the Effect HTTP application for Cloudflare Workers.
 * Returns a fetch handler that can be used as the default export.
 */
function createEffectApp(env: Env) {
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

  // BookRepo layer depends on Database (via the db parameter in BookRepoLive)
  // Since BookRepoLive takes db directly, it's already satisfied
  const bookRepoLayer = BookRepoLive(db)

  // BooksHandlers layer depends on BookRepo
  const booksHandlersLayer = BooksHandlers.pipe(Layer.provide(bookRepoLayer))

  // Merge all layers - build from the bottom up
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
  const { handler } = HttpApp.toWebHandlerLayer(appWithCors, appLayer)

  return { handler }
}

/**
 * Cloudflare Workers default export.
 * Provides the fetch handler that processes all incoming requests.
 */
export default {
  fetch: (
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> => {
    const { handler } = createEffectApp(env)
    return handler(request)
  },
}
