import {
  HttpLayerRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { env } from "cloudflare:workers"
import { drizzle } from "drizzle-orm/d1"
import { Effect, Layer, Schema } from "effect"
import { schema } from "shared/schema"
import { Auth } from "./lib/auth/main"
import { Database } from "./lib/db"
import { EnvContext, EnvSchema } from "./lib/env"
import { RpcRoutes } from "./rpc/handler"

const EnvLive = Layer.effect(EnvContext, Schema.decodeUnknown(EnvSchema)(env))
const DatabaseLive = Layer.sync(Database, () => drizzle(env.DB, { schema }))
const ServicesLive = Layer.merge(EnvLive, DatabaseLive)

const HealthRoute = HttpLayerRouter.use((router) =>
  router.add(
    "GET",
    "/",
    HttpServerResponse.text("I'm FINE. Thanks for asking. Finally."),
  ),
)

export const handleAuthRequest = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest
  const auth = yield* Auth

  const rawRequest = yield* HttpServerRequest.toWeb(request)
  const response = yield* Effect.promise(() => auth.handler(rawRequest))

  return yield* HttpServerResponse.fromWeb(response)
})

const AuthRoutes = HttpLayerRouter.use((router) =>
  router.add("*", "/api/auth/*", handleAuthRequest),
).pipe(Layer.provide(Auth.Default))

const AppLive = Layer.mergeAll(HealthRoute, AuthRoutes, RpcRoutes).pipe(
  Layer.provide(ServicesLive),
)

const { handler } = HttpLayerRouter.toWebHandler(AppLive)

export default handler
