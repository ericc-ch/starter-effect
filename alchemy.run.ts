import alchemy, { type Scope } from "alchemy"
import { CloudflareStateStore, FileSystemStateStore } from "alchemy/state"
import { D1Database, Worker, TanStackStart } from "alchemy/cloudflare"
import { Exec } from "alchemy/os"
import { config } from "dotenv"
import { z } from "zod"

config({ path: "./.env" })
config({ path: "./apps/api/.env" })
config({ path: "./apps/web/.env" })

// NOTE: Can't import env schemas from apps due to TypeScript project boundaries
// See: apps/api/src/lib/env.ts, apps/web/src/lib/env.ts

const alchemyEnvSchema = z.object({
  ALCHEMY_PASSWORD: z.string().min(1),
  ALCHEMY_STAGE: z.enum(["dev", "main"]).default("dev"),
  ALCHEMY_REMOTE_STATE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
})

const remoteEnvSchema = z.object({
  WEB_DOMAIN: z.string().min(1),
  API_DOMAIN: z.string().min(1),
})

const apiEnvSchema = z.object({
  API_CORS_ORIGIN: z.url().default("http://localhost:5173"),
  API_BETTER_AUTH_SECRET: z.string().min(1),
  API_BETTER_AUTH_URL: z.url().default("http://localhost:1337"),
})

const alchemyEnv = alchemyEnvSchema.parse(process.env)
const apiEnv = apiEnvSchema.parse(process.env)
const remoteEnv =
  alchemyEnv.ALCHEMY_REMOTE_STATE ? remoteEnvSchema.parse(process.env) : null

const app = await alchemy("starter-effect", {
  password: alchemyEnv.ALCHEMY_PASSWORD,
  stage: alchemyEnv.ALCHEMY_STAGE,
  stateStore: (scope: Scope) =>
    remoteEnv ?
      new CloudflareStateStore(scope)
    : new FileSystemStateStore(scope),
})

await Exec("db-generate", {
  command: "pnpm run db:generate",
})

const db = await D1Database("db", {
  migrationsDir: "./migrations/",
})

export const api = await Worker("api", {
  cwd: "./apps/api",
  entrypoint: "./src/main.ts",
  compatibility: "node",
  domains: remoteEnv ? [remoteEnv.API_DOMAIN] : [],
  bindings: {
    DB: db,
    API_CORS_ORIGIN: apiEnv.API_CORS_ORIGIN,
    API_BETTER_AUTH_SECRET: alchemy.secret(apiEnv.API_BETTER_AUTH_SECRET),
    API_BETTER_AUTH_URL: apiEnv.API_BETTER_AUTH_URL,
  },
})

export const web = await TanStackStart("web", {
  cwd: "./apps/web",
  compatibility: "node",
  domains: remoteEnv ? [remoteEnv.WEB_DOMAIN] : [],
})

console.log(`Web -> ${web.url}`)
console.log(`API -> ${api.url}`)

await app.finalize()
