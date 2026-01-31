import { betterAuth } from "better-auth"
import { admin, organization } from "better-auth/plugins"
import { drizzleAdapter, type DB } from "better-auth/adapters/drizzle"
import { ac, owner, admin as orgAdmin, teacher, student } from "shared/auth"
import type { ParsedEnv } from "./env"

export const createAuth = (env: ParsedEnv, db: DB) =>
  betterAuth({
    secret: env.API_BETTER_AUTH_SECRET,
    baseURL: env.API_BETTER_AUTH_URL,
    trustedOrigins: [env.API_CORS_ORIGIN],
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
      camelCase: true,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    plugins: [
      admin(),
      organization({
        ac,
        roles: {
          owner,
          admin: orgAdmin,
          teacher,
          student,
        },
        // Default role when joining an org
        memberRole: "student",
        // Default role for org creator
        creatorRole: "owner",
      }),
    ],
  })

// dummy auth because better-auth cli doesn't actually use tsconfig
// avoids resolving db and schema
export const auth = createAuth(
  {
    API_BETTER_AUTH_SECRET: "dummy-secret",
    API_BETTER_AUTH_URL: "http://localhost:1337",
    API_CORS_ORIGIN: "http://localhost:5173",
  },
  {} as DB,
)
