import { oc } from "@orpc/contract"
import * as z from "zod"

const memberOutput = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: z.string(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
})

const listMembers = oc
  .route({
    path: "/{id}/members",
    method: "GET",
  })
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .output(
    z.object({
      members: z.array(memberOutput),
      total: z.number(),
    }),
  )

const addMember = oc
  .route({
    path: "/{id}/members",
    method: "POST",
  })
  .input(
    z.object({
      id: z.string(),
      userId: z.string(),
      role: z.enum(["owner", "admin", "teacher", "student"]),
    }),
  )
  .output(memberOutput)

const removeMember = oc
  .route({
    path: "/{id}/members/{memberId}",
    method: "DELETE",
  })
  .input(
    z.object({
      id: z.string(),
      memberId: z.string(),
    }),
  )
  .output(
    z.object({
      member: z.object({
        id: z.string(),
        userId: z.string(),
        organizationId: z.string(),
        role: z.string(),
      }),
    }),
  )

const updateMemberRole = oc
  .route({
    path: "/{id}/members/{memberId}/role",
    method: "POST",
  })
  .input(
    z.object({
      id: z.string(),
      memberId: z.string(),
      role: z.enum(["owner", "admin", "teacher", "student"]),
    }),
  )
  .output(memberOutput)

export const organizationMembers = oc
  .prefix("/superadmin/organizations")
  .router({
    listMembers,
    addMember,
    removeMember,
    updateMemberRole,
  })
