import { RpcGroup } from "@effect/rpc"
import { BooksRpcGroup } from "./groups/books"

export const RootRpcGroup = RpcGroup.make().merge(BooksRpcGroup)
export type RootRpcContract = typeof RootRpcGroup
