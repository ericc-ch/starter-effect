import { HttpServerRequest } from "@effect/platform"
import { Context, Effect, Layer, Option, Schema } from "effect"
import { Auth } from "./main"

export class CurrentUser extends Context.Tag("api/lib/auth/CurrentUser")<
  CurrentUser,
  {
    id: string
    email: string
    name: string
    emailVerified: boolean
    image?: string | null
  }
>() {}

export const SessionSchema = Schema.Struct({
  session: Schema.Struct({
    id: Schema.String,
    userId: Schema.String,
    token: Schema.String,
    expiresAt: Schema.Date,
    ipAddress: Schema.NullOr(Schema.String),
    userAgent: Schema.NullOr(Schema.String),
  }),
  user: Schema.Struct({
    id: Schema.String,
    email: Schema.String,
    name: Schema.String,
    emailVerified: Schema.Boolean,
    image: Schema.NullOr(Schema.String),
  }),
})

export type Session = typeof SessionSchema.Type

export const extractSession = Effect.gen(function* () {
  const request = yield* HttpServerRequest.HttpServerRequest
  const auth = yield* Auth

  const headers = new Headers(
    Object.entries(request.headers as Record<string, string>),
  )

  const session = yield* Effect.promise(() => auth.api.getSession({ headers }))

  if (!session) {
    return Option.none<Session>()
  }

  const decoded = yield* Schema.decodeUnknown(SessionSchema)(session)
  return Option.some(decoded)
})

export const requireAuth = Effect.gen(function* () {
  const sessionOpt = yield* extractSession

  if (Option.isNone(sessionOpt)) {
    return yield* Effect.fail(
      new UnauthorizedError({ message: "Unauthorized" }),
    )
  }

  return sessionOpt.value.user
})

export const optionalAuth = Effect.gen(function* () {
  const sessionOpt = yield* extractSession
  return Option.map(sessionOpt, (session) => session.user)
})

export const CurrentUserLive = Layer.effect(
  CurrentUser,
  Effect.gen(function* () {
    const user = yield* requireAuth
    return user
  }),
)

export const CurrentUserOptionalLive = Layer.effect(
  CurrentUser,
  Effect.gen(function* () {
    const userOpt = yield* optionalAuth
    return Option.getOrElse(userOpt, () => ({
      id: "",
      email: "",
      name: "",
      emailVerified: false,
      image: null,
    }))
  }),
)

export class UnauthorizedError extends Schema.TaggedError<UnauthorizedError>(
  "UnauthorizedError",
)("UnauthorizedError", { message: Schema.String }) {}
