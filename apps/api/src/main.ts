import {
  HttpApp,
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { env } from "cloudflare:workers"
import { Effect, Layer } from "effect"
import { Auth } from "./lib/auth/main"
import { makeService } from "./lib/service"
import { RpcHandlerLive, RootRpcHandler } from "./rpc/handler"

const handleAuthRequest = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest
  const auth = yield* Auth

  const rawRequest = yield* HttpServerRequest.toWeb(request)
  const response = yield* Effect.promise(() => auth.handler(rawRequest))

  return yield* HttpServerResponse.fromWeb(response)
})

const ServiceLive = makeService(env)
const AppLive = RpcHandlerLive.pipe(Layer.provide(ServiceLive))

// Build the router - this creates the HttpApp
const makeHttpApp = Effect.gen(function* () {
  const rpcHandler = yield* RootRpcHandler

  const router = HttpRouter.empty.pipe(
    HttpRouter.get("/", HttpServerResponse.json({ status: "ok" })),
    HttpRouter.mountApp("/api/auth", handleAuthRequest),
    HttpRouter.mountApp("/rpc", rpcHandler),
  )

  return yield* HttpRouter.toHttpApp(router)
})

// Run the construction effect - this satisfies RPC handler requirements
// The returned HttpApp still needs Auth for handleAuthRequest
const httpApp = makeHttpApp.pipe(
  Effect.provide(AppLive),
  Effect.scoped,
  Effect.runSync,
)

// Create the handler with Auth layer provided at request time
const { handler } = HttpApp.toWebHandlerLayer(httpApp, ServiceLive)

export default handler
