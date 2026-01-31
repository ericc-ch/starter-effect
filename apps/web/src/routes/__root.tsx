import { Toaster } from "@/components/sonner"
import { ThemeSync } from "@/components/theme-sync"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { Outlet, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { useEffect } from "react"

export const Route = createRootRoute({
  component: () => {
    useEffect(() => {
      if (import.meta.env.DEV) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/react-scan/dist/auto.global.js"
        document.head.appendChild(script)
      }
    }, [])

    return (
      <>
        <Outlet />
        <ThemeSync />
        <Toaster expand richColors />
        {import.meta.env.DEV && (
          <TanStackDevtools
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
      </>
    )
  },
})
