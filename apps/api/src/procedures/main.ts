import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { implement, onError, ORPCError, ValidationError } from "@orpc/server"
import { contract } from "shared/contract"
import type { Context } from "../lib/orpc/context"
import { bookProcedures } from "./books"
import { organizationMembersProcedures } from "./organization-members"
import { organizationsProcedures } from "./organizations"
import { usersProcedures } from "./users"

const os = implement(contract).$context<Context>()

export const procedures = new OpenAPIHandler(
  os.router({
    books: bookProcedures,
    organizations: organizationsProcedures,
    organizationMembers: organizationMembersProcedures,
    users: usersProcedures,
  }),
  {
    clientInterceptors: [
      onError((error) => {
        console.error(error)

        if (error instanceof ORPCError) {
          if (error.cause instanceof ValidationError) {
            console.error(JSON.stringify(error.cause, null, 2))
          }
        }
      }),
    ],
  },
)
