import { RpcGroup } from "@effect/rpc"
import { BooksRpcGroup } from "../features/books"

export const RootRpcGroup = RpcGroup.make().merge(BooksRpcGroup)
export type RootRpcContract = typeof RootRpcGroup
