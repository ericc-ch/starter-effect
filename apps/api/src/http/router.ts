import { HttpRouter, HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"
import { handleAuthRequest } from "../lib/auth/http"
import { createRpcHttpApp } from "../rpc/server"

export const createRouter = Effect.gen(function* () {
  // Create RPC HttpApp from the root RPC group
  // Note: Handler layers (BooksHandlers, BookRepo) are provided at the app level in main.ts
  const rpcHttpApp = yield* createRpcHttpApp

  // Create the main router with mounted apps
  return HttpRouter.empty.pipe(
    HttpRouter.get("/", HttpServerResponse.json({ status: "ok" })),
    HttpRouter.mountApp("/api/auth", handleAuthRequest),
    HttpRouter.mountApp("/rpc", rpcHttpApp),
  )
})
