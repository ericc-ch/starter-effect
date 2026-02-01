import { HttpApp } from "@effect/platform"
import { RpcServer } from "@effect/rpc"
import { Effect } from "effect"
import { RootRpcGroup } from "./main"

/**
 * Creates an HTTP App from the root RPC group.
 *
 * This function returns an Effect that yields an HttpApp.Default, which can be
 * mounted in the HTTP router. Handler layers should be provided at mount time
 * using Effect.provide.
 *
 * @returns Effect containing the HTTP app for the RPC server
 */
export const createRpcHttpApp = Effect.gen(function* () {
  const rpcHttpApp = yield* RpcServer.toHttpApp(RootRpcGroup, {
    disableTracing: false,
    spanPrefix: "RpcServer",
  })

  return rpcHttpApp
})

/**
 * Type alias for the RPC HTTP app effect.
 * This represents an unconfigured RPC server that needs handler layers.
 */
export type RpcHttpAppEffect = Effect.Effect<
  HttpApp.Default,
  never,
  // Context requirements will be determined by the handlers provided
  never
>
