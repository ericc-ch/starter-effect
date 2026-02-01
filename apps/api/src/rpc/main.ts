import { RpcGroup } from "@effect/rpc"
import { BooksRpcGroup } from "./contract/books"

// Root RPC Group that combines all domain-specific RPC groups
// Currently only has Books, but can be extended with more groups
export const RootRpcGroup = RpcGroup.make().merge(BooksRpcGroup)

// Export type for client usage
export type RootRpcContract = typeof RootRpcGroup
