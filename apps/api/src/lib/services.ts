import { Schema, Layer } from "effect"
import { makeAuth } from "./auth/make"
import { createDB, Database } from "./db"
import { EnvSchema, type EnvType, EnvContext } from "./env"

export type Services = {
  env: EnvType
  db: GenericSQLite
  auth: ReturnType<typeof makeAuth>
}

// Re-export Database type for convenience
export type GenericSQLite = ReturnType<typeof createDB>

export function createServices(cloudflareEnv: {
  DB: D1Database
  API_CORS_ORIGIN?: string
  API_BETTER_AUTH_SECRET: string
  API_BETTER_AUTH_URL?: string
}): Services {
  const env = Schema.decodeUnknownSync(EnvSchema)(cloudflareEnv)
  const db = createDB(cloudflareEnv.DB)
  return {
    env,
    db,
    auth: makeAuth(env, db),
  }
}

// Create a Layer from services
export function createServicesLayer(cloudflareEnv: {
  DB: D1Database
  API_CORS_ORIGIN?: string
  API_BETTER_AUTH_SECRET: string
  API_BETTER_AUTH_URL?: string
}) {
  const services = createServices(cloudflareEnv)

  return Layer.mergeAll(
    Layer.succeed(EnvContext, services.env),
    Layer.succeed(Database, services.db),
  )
}
