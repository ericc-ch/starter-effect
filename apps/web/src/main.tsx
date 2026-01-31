import "./global.css"

import "./lib/i18n"

import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { routeTree } from "./routeTree.gen"
import { queryClient } from "./lib/query-client"

const router = createRouter({
  routeTree,
  scrollRestoration: true,
})

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Root element not found")

const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
