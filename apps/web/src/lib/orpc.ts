import type { JsonifiedClient } from "@orpc/openapi-client"

import { createORPCClient } from "@orpc/client"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { contract, type RPCClient } from "shared/contract"
import { env } from "./env"

const link = new OpenAPILink(contract, {
  url: `${env.VITE_API_URL}/rpc`,
  fetch: (request, init) => {
    return globalThis.fetch(request, {
      ...init,
      credentials: "include",
    })
  },
})

export const orpc: JsonifiedClient<RPCClient> = createORPCClient(link)

export const orpcQuery = createTanstackQueryUtils(orpc)
