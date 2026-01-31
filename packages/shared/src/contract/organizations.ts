import { oc } from "@orpc/contract"
import * as schema from "../schema/main"
import { z } from "zod"
import { createSelectSchema } from "drizzle-zod"

const organizationSelect = createSelectSchema(schema.organizations)

const list = oc
  .route({
    method: "GET",
  })
  .output(z.array(organizationSelect))

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
  .output(organizationSelect)

const create = oc
  .route({
    method: "POST",
  })
  .input(
    z.object({
      name: z.string().min(1).max(255),
      slug: z
        .string()
        .min(1)
        .max(255)
        .regex(/^[a-z0-9-]+$/),
    }),
  )
  .output(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      logo: z.string().nullable().optional(),
      createdAt: z.date(),
      metadata: z.any(),
      members: z.array(
        z
          .object({
            id: z.string(),
            organizationId: z.string(),
            userId: z.string(),
            role: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      ),
    }),
  )

export const organizations = oc.prefix("/superadmin/organizations").router({
  get,
  create,
  list,
})
