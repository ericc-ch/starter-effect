import { HttpLayerRouter } from "@effect/platform"
import { RpcSerialization, RpcServer } from "@effect/rpc"
import { Effect, Layer } from "effect"
import { BooksHandlers } from "./books/handler"
import { RootRpcGroup } from "./contract"

export const RpcSerializationLive = RpcSerialization.layerJsonRpc()

export const RpcRoutes = HttpLayerRouter.use((router) =>
  Effect.gen(function* () {
    const httpApp = yield* RpcServer.toHttpApp(RootRpcGroup)
    yield* router.add("POST", "/rpc/*", httpApp)
  }),
).pipe(Layer.provide(RpcSerializationLive), Layer.provide(BooksHandlers))
