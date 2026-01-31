import type { ContractRouterClient } from "@orpc/contract"
import { books } from "./books"
import { organizationMembers } from "./organization-members"
import { organizations } from "./organizations"
import { users } from "./users"

export const contract = {
  books,
  organizations,
  organizationMembers,
  users,
}

export type RPCClient = ContractRouterClient<typeof contract>
