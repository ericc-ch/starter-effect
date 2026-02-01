import { drizzle } from "drizzle-orm/d1"
import { Layer, Schema } from "effect"
import { schema } from "shared/schema"
import { Database } from "./db"
import { EnvContext, EnvSchema } from "./env"

export const runtimeLayer = (env: Env) => {
  const EnvLive = Layer.effect(EnvContext, Schema.decodeUnknown(EnvSchema)(env))
  const DatabaseLive = Layer.sync(Database, () => drizzle(env.DB, { schema }))

  return Layer.mergeAll(EnvLive, DatabaseLive)
}
