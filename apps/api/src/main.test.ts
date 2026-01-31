import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { schema } from "shared/schema"
import { describe, expect, it } from "vitest"
import { createApp } from "./app"
import type { DB } from "./lib/db"
import { createServices } from "./lib/services"

const client = createClient({ url: ":memory:" })
const db: DB = drizzle({ client, schema })

const mockEnv = {
  DB: db,
  API_CORS_ORIGIN: "http://localhost:5173",
  API_BETTER_AUTH_SECRET: "test-secret",
  API_BETTER_AUTH_URL: "http://localhost:1337",
} as unknown as Env

const app = createApp(createServices(mockEnv))

describe("api", () => {
  it("returns ok on /", async () => {
    const res = await app.request("/")
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: "ok" })
  })
})
