import { HttpServerRequest } from "@effect/platform"
import { Effect } from "effect"
import { Auth } from "../../lib/auth/main"
import { UnauthorizedError } from "../errors"

export const getSession = Effect.gen(function* () {
  const auth = yield* Auth
  const request = yield* HttpServerRequest.HttpServerRequest

  const session = yield* Effect.promise(() =>
    auth.api.getSession({ headers: request.headers }),
  )

  if (!session) {
    return yield* new UnauthorizedError({ message: "Unauthorized" })
  }

  return session
})
