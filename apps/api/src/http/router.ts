import { HttpRouter, HttpServerResponse } from "@effect/platform"
import { RpcServer } from "@effect/rpc"
import { Effect } from "effect"
import { handleAuthRequest } from "../lib/auth/http"
import { BooksRpcGroup } from "../rpc/contract/books"
import { BooksHandlers } from "../rpc/handlers/books"

export const createRouter = Effect.gen(function* () {
  // Create RPC HttpApp from the RPC group
  const rpcHttpApp = yield* RpcServer.toHttpApp(BooksRpcGroup, {
    disableTracing: false,
    spanPrefix: "RpcServer",
  })

  // Provide the handler implementations to the RPC app
  const rpcHttpAppWithHandlers = rpcHttpApp.pipe(Effect.provide(BooksHandlers))

  // Create the main router with mounted apps
  return HttpRouter.empty.pipe(
    HttpRouter.get("/", HttpServerResponse.json({ status: "ok" })),
    HttpRouter.mountApp("/api/auth", handleAuthRequest),
    HttpRouter.mountApp("/rpc", rpcHttpAppWithHandlers),
  )
})
