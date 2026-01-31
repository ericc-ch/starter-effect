import { D1Client } from "@effect/sql-d1"
import { Context, Effect, Layer, ManagedRuntime, Schema } from "effect"
import { EnvSchema, type ParsedEnv } from "./env"

// Service Tags
export class EnvConfig extends Context.Tag("EnvConfig")<
  EnvConfig,
  ParsedEnv
>() {}

export class CloudflareBindings extends Context.Tag("CloudflareBindings")<
  CloudflareBindings,
  Env
>() {}

// export const D1Live = (d1: D1Database) => D1.D1Client.layer({ db: d1 })

const makeD1Live = Effect.gen(function* () {
  const bindings = yield* CloudflareBindings
  return D1Client.layer({ db: bindings.DB })
})

export const BindingsLive = (bindings: Env) =>
  Layer.succeed(CloudflareBindings, bindings)

export const makeRuntime = Effect.fn(function* (env: Env) {
  const BindingsLive = Layer.succeed(CloudflareBindings, env)
  const EnvLive = Layer.effect(EnvConfig, Schema.decodeUnknown(EnvSchema)(env))
  const D1Live = yield* makeD1Live.pipe(Effect.provide(BindingsLive))

  return Layer.mergeAll(
    D1Live(config.db),
    EnvLive(config.env),
    BindingsLive(config.env),
  )
}

export const createRuntime = (config: Env) => {
  const layer = makeRuntime(config)
  return ManagedRuntime.make(layer)
}

// Export types
export type { D1Client } from "@effect/sql-d1/D1Client"
