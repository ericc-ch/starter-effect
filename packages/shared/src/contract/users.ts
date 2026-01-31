import { oc } from "@orpc/contract"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import * as schema from "../schema/main"

const userSelect = createSelectSchema(schema.users)

const list = oc
  .route({
    method: "GET",
  })
  .output(
    z.object({
      users: z.array(userSelect),
      total: z.number(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
  )

const get = oc
  .route({
    path: "/{id}",
    method: "GET",
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(userSelect)

const create = oc
  .route({
    method: "POST",
  })
  .input(
    z.object({
      email: z.email(),
      password: z.string().min(8).optional(),
      name: z.string().min(1).max(255),
      role: z.enum(["admin", "user"]).default("user"),
    }),
  )
  .output(userSelect)

const update = oc
  .route({
    path: "/{id}",
    method: "POST",
  })
  .input(
    z.object({
      id: z.string(),
      data: z.object({
        name: z.string().min(1).max(255).optional(),
        email: z.email().optional(),
        role: z.enum(["admin", "user"]).optional(),
      }),
    }),
  )
  .output(userSelect)

const remove = oc
  .route({
    path: "/{id}",
    method: "DELETE",
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(
    z.object({
      success: z.boolean(),
    }),
  )

export const users = oc.prefix("/superadmin/users").router({
  list,
  get,
  create,
  update,
  remove,
})
