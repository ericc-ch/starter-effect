import { RpcSerialization, RpcServer } from "@effect/rpc"
import { Layer } from "effect"
import { BooksHandlers } from "./books/handler"
import { RootRpcGroup } from "./contract"

export const RpcHandlerLive = Layer.empty.pipe(
  Layer.merge(RpcSerialization.layerJsonRpc()),
  Layer.merge(BooksHandlers),
)

// Don't provide layers here - let main.ts provide everything
export const RootRpcHandler = RpcServer.toHttpApp(RootRpcGroup)
