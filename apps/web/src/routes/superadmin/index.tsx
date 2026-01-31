import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/superadmin/")({
  component: AdminPage,
})

function AdminPage() {
  const { session } = Route.useRouteContext()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
    </div>
  )
}
