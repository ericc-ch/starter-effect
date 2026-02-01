import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"
import { Auth } from "./main"

export const handleAuthRequest = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest
  const auth = yield* Auth

  const rawRequest = yield* HttpServerRequest.toWeb(request)

  const response = yield* Effect.promise(() => auth.handler(rawRequest))

  return yield* HttpServerResponse.fromWeb(response)
})
