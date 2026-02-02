import {
  HttpApp,
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform"
import { env } from "cloudflare:workers"
import { Effect } from "effect"
import { Auth } from "./lib/auth/main"
import { makeService } from "./lib/services"
import { RootRpcHandler } from "./rpc/handler"

export const handleAuthRequest = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest
  const auth = yield* Auth

  const rawRequest = yield* HttpServerRequest.toWeb(request)
  const response = yield* Effect.promise(() => auth.handler(rawRequest))

  return yield* HttpServerResponse.fromWeb(response)
})

const app = Effect.gen(function* () {
  const rpcHandler = yield* RootRpcHandler

  return yield* HttpRouter.empty.pipe(
    HttpRouter.get("/", HttpServerResponse.json({ status: "ok" })),
    HttpRouter.mountApp("/api/auth", handleAuthRequest),
    HttpRouter.mountApp("/rpc", rpcHandler),
    HttpRouter.toHttpApp,
  )
}).pipe(Effect.provide(makeService(env)), Effect.scoped)

export default app.pipe(Effect.andThen(HttpApp.toWebHandler))
