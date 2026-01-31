import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db"
import { z } from "zod"

const themeSchema = z.object({
  mode: z.enum(["light", "dark", "system"]),
})

type Theme = z.infer<typeof themeSchema>["mode"]

const STORAGE_KEY = "verion-theme"

export const themeCollection = createCollection(
  localStorageCollectionOptions({
    storageKey: STORAGE_KEY,
    schema: themeSchema,
    getKey: () => "preference",
  }),
)

export function setTheme(mode: Theme) {
  const existing = themeCollection.state.size > 0
  if (existing) {
    themeCollection.update("preference", (draft) => {
      draft.mode = mode
    })
  } else {
    themeCollection.insert({ mode })
  }
}
