import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { zodValidator } from "@tanstack/zod-adapter";
import { eq } from "drizzle-orm/sql";
import { ResultAsync } from "neverthrow";
import * as z from "zod/v4";
import { authClient, userSchema, type User } from "~/lib/auth";
import { requireAdminMiddleware } from "~/server/admin";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { user } from "~/server/db/schema/auth";

export const listAllUsersQuery = queryOptions({
  queryKey: ["admin", "list-users"],
  queryFn: async () => {
    const res = await authClient.admin.listUsers({
      query: {},
    });

    if (res.error) throw res.error;

    return res.data as NonNullable<
      | {
          users: User[];
          total: number;
          limit: number | undefined;
          offset: number | undefined;
        }
      | {
          users: never[];
          total: number;
        }
    >;
  },
});

export const checkIfUserExists = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(z.object({ id: z.string() })))
  .handler(async (ctx) => {
    const res = await auth.api.getUser({
      query: {
        id: ctx.data.id,
      },
      headers: getRequest().headers,
    });

    if (!res)
      return {
        exists: false,
        data: null,
      };

    return {
      exists: true,
      data: res as User,
    };
  });

export const updateUser = createServerFn({ method: "POST" })
  .inputValidator(
    zodValidator(
      z.object({
        userId: z.string(),
        data: userSchema.omit({ id: true }).partial(),
      })
    )
  )
  .middleware([requireAdminMiddleware])
  .handler(async ({ data }) => {
    const result = await ResultAsync.fromPromise<User[], Error>(
      db
        .update(user)
        .set(data.data)
        .where(eq(user.id, data.userId))
        .returning(),
      (e) => e as Error
    );

    if (result.isErr()) {
      return { success: false, error: result.error.message };
    }

    return { success: true, user: result.value[0] };
  });

export function getUserOptions(id: string) {
  return queryOptions({
    queryKey: ["admin", "get-user", id],
    queryFn: async () => {
      const res = await authClient.admin.getUser({
        query: {
          id: id,
        },
      });

      if (res.error) throw res.error;

      return res.data as User;
    },
  });
}
