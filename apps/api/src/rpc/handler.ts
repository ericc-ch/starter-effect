import { RpcSerialization, RpcServer } from "@effect/rpc"
import { Effect, Layer } from "effect"
import { BooksHandlers } from "./books/handler"
import { RootRpcGroup } from "./contract"

const RpcHandlerLive = Layer.empty.pipe(
  Layer.merge(RpcSerialization.layerJsonRpc()),
  Layer.merge(BooksHandlers),
)

export const RootRpcHandler = RpcServer.toHttpApp(RootRpcGroup).pipe(
  Effect.provide(RpcHandlerLive),
)
