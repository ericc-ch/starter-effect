import { Schema } from "effect"
import { createAuth } from "./auth"
import { createDB, type DB } from "./db"
import { EnvSchema, type ParsedEnv } from "./env"

export type Services = {
  env: ParsedEnv
  db: DB
  auth: ReturnType<typeof createAuth>
}

export function createServices(cloudflareEnv: Env): Services {
  const env = Schema.decodeUnknownSync(EnvSchema)(cloudflareEnv)
  const db = createDB(cloudflareEnv.DB)
  return {
    env,
    db,
    auth: createAuth(env, db),
  }
}
