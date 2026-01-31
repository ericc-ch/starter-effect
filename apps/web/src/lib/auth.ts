import { createAuthClient } from "better-auth/client"
import { adminClient, organizationClient } from "better-auth/client/plugins"
import { ac, owner, admin, teacher, student } from "shared/auth"
import { env } from "./env"

export const auth = createAuthClient({
  baseURL: env.VITE_API_URL + "/api/auth",
  plugins: [
    adminClient(),
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        teacher,
        student,
      },
    }),
  ],
})
