import { drizzle } from "drizzle-orm/d1"
import { Layer, ManagedRuntime, Schema } from "effect"
import { schema } from "shared/schema"
import { Database } from "./db"
import { EnvContext, EnvSchema } from "./env"
import { Auth } from "./auth/main"

export const makeRuntime = (env: Env) => {
  const EnvLive = Layer.effect(EnvContext, Schema.decodeUnknown(EnvSchema)(env))
  const DatabaseLive = Layer.sync(Database, () => drizzle(env.DB, { schema }))

  const AppLive = Layer.empty.pipe(
    Layer.merge(Auth.Default),
    Layer.provide(EnvLive),
    Layer.provideMerge(DatabaseLive),
  )

  return ManagedRuntime.make(AppLive)
}
