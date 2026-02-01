import { HttpRouter, HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"
import { handleAuthRequest } from "../lib/auth/http"
import { BooksHandlers } from "../rpc/handlers/books"
import { createRpcHttpApp } from "../rpc/server"

export const createRouter = Effect.gen(function* () {
  // Create RPC HttpApp from the root RPC group
  const rpcHttpApp = yield* createRpcHttpApp

  // Provide the handler implementations to the RPC app
  const rpcHttpAppWithHandlers = rpcHttpApp.pipe(Effect.provide(BooksHandlers))

  // Create the main router with mounted apps
  return HttpRouter.empty.pipe(
    HttpRouter.get("/", HttpServerResponse.json({ status: "ok" })),
    HttpRouter.mountApp("/api/auth", handleAuthRequest),
    HttpRouter.mountApp("/rpc", rpcHttpAppWithHandlers),
  )
})
