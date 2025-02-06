import { protectedCaller } from "../actions/auth";
import { db } from "../db";
import { users } from "../db/schema";
import { error$ } from "@solid-mediakit/prpc";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { Permission, permissionsSchema } from "~/lib/permissions";

export const getOtherUsers = protectedCaller(async ({ ctx$ }) => {
    "use server";
    if (!ctx$.user || ctx$.user.role !== "ADMIN") {
        return error$("unauthorised", {
            status: 403,
        });
    }

    const otherUsers = await db
        .select()
        .from(users)
        .where(sql`${users.id} != ${ctx$.user.id}`);

    return otherUsers;
});

export const getUser = protectedCaller(
    z.object({
        id: z.string(),
    }),
    async ({ ctx$, input$ }) => {
        "use server";

        if (ctx$.user.role !== "ADMIN") {
            return error$("unauthorised", {
                status: 403,
            });
        }

        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, input$.id));

        return user[0];
    },
    {
        cache: false,
    }
);

export const togglePermission = protectedCaller(
    z.object({
        userId: z.string(),
        permission: permissionsSchema,
    }),
    async ({ input$, ctx$ }) => {
        "use server";
        if (!ctx$.user || ctx$.user.role !== "ADMIN") {
            return error$("unauthorised", {
                status: 403,
            });
        }

        const user = (
            await db
                .select()
                .from(users)
                .where(eq(users.id, input$.userId))
                .limit(1)
        )[0];

        if (!user)
            return error$("user not found", {
                status: 404,
            });

        const updatedPermissions: Permission[] = [...user.permissions];

        const permissionIndex = updatedPermissions.indexOf(input$.permission);

        if (permissionIndex === -1) {
            // if permission is not in the array, add it
            updatedPermissions.push(input$.permission);
        } else {
            // if permission is in the array, remove it
            updatedPermissions.splice(permissionIndex, 1);
        }

        const updatedUser = await db
            .update(users)
            .set({ permissions: updatedPermissions })
            .where(eq(users.id, input$.userId))
            .returning()
            .catch((err) => {
                console.error(err);
                return error$("unexpected error", {
                    status: 500,
                });
            });

        return updatedUser;
    },
    {
        type: "action",
        method: "POST",
    }
);
