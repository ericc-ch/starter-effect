import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { schema } from "shared/schema"
import { describe, expect, it } from "vitest"
import { createDB, Database } from "./lib/db"
import { EnvContext, EnvSchema } from "./lib/env"
import { Effect, Layer, Schema } from "effect"
import { HttpApp, HttpRouter } from "@effect/platform"
import { RpcSerialization } from "@effect/rpc"
import { createRouter } from "./http/router"
import { corsMiddleware } from "./lib/http/cors"
import { Auth } from "./lib/auth/main"
import { BookRepoLive } from "./rpc/services/books"
import { BooksHandlers } from "./rpc/handlers/books"

const client = createClient({ url: ":memory:" })
const mockD1Db = drizzle({ client, schema })

const mockEnv = {
  DB: mockD1Db,
  API_CORS_ORIGIN: "http://localhost:5173",
  API_BETTER_AUTH_SECRET: "test-secret",
  API_BETTER_AUTH_URL: "http://localhost:1337",
} as unknown as Env

/**
 * Creates the Effect HTTP application for testing.
 */
function createTestApp(env: typeof mockEnv) {
  // Parse and validate environment
  const parsedEnv = Schema.decodeUnknownSync(EnvSchema)(env)

  // The env.DB is already a drizzle database (GenericSQLite type)
  const testDb = env.DB as unknown as ReturnType<typeof createDB>

  // Create base layers (no dependencies)
  const envContextLayer = Layer.succeed(EnvContext, parsedEnv)
  const dbLayer = Layer.succeed(Database, testDb)
  const rpcSerializationLayer = RpcSerialization.layerJson

  // Auth layer depends on EnvContext and Database
  const authLayer = Auth.Default.pipe(
    Layer.provide(envContextLayer),
    Layer.provide(dbLayer),
  )

  // BookRepo layer depends on Database (via the db parameter in BookRepoLive)
  const bookRepoLayer = BookRepoLive(testDb)

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

const { handler } = createTestApp(mockEnv)

describe("api", () => {
  it("returns ok on /", async () => {
    const request = new Request("http://localhost/")
    const res = await handler(request)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: "ok" })
  })
})
