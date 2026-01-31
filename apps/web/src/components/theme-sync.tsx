import { useEffect } from "react"
import { useLiveQuery } from "@tanstack/react-db"
import { themeCollection } from "@/lib/theme"

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ?
      "dark"
    : "light"
}

export function ThemeSync() {
  const { data } = useLiveQuery(() => themeCollection)
  const theme = data?.at(0)?.mode ?? "system"

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme === "system" ? getSystemTheme() : theme)
    }

    applyTheme()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", applyTheme)
    return () => mediaQuery.removeEventListener("change", applyTheme)
  }, [theme])

  return null
}
