import { RpcGroup } from "@effect/rpc"
import { BooksRpcGroup } from "./books/contract"

export const RootRpcGroup = RpcGroup.make().merge(BooksRpcGroup)
