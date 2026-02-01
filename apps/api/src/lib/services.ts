import { Schema } from "effect"
import { makeAuth } from "./auth"
import { createDB, type DB } from "./db"
import { EnvSchema, type EnvType } from "./env"

export type Services = {
  env: EnvType
  db: DB
  auth: ReturnType<typeof makeAuth>
}

export function createServices(cloudflareEnv: EnvSchema): Services {
  const env = Schema.decodeUnknownSync(EnvSchema)(cloudflareEnv)
  const db = createDB(cloudflareEnv.DB)
  return {
    env,
    db,
    auth: makeAuth(env, db),
  }
}
