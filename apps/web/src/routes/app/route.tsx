import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { auth } from "../../lib/auth"

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    const { data: session } = await auth.getSession()

    if (!session) {
      throw redirect({
        to: "/login",
      })
    }

    if (session.user.role === "admin") {
      throw redirect({
        to: "/superadmin",
      })
    }

    return { session }
  },
  component: () => <Outlet />,
})
