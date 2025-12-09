import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "~/server/auth";
import * as z from "zod/v4";
import { Permissions } from "./permissions";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const userSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string(),
  emailVerified: z.boolean(),
  name: z.string(),
  image: z.string().nullable().optional(),
  permissions: Permissions.array(),
  banned: z.boolean().nullable().optional(),
  role: z.string().nullable().optional(),
  banReason: z.string().nullable().optional(),
  banExpires: z.date().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Session = typeof auth.$Infer.Session.session;
