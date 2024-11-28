import { db } from "../db";
import { Permission, permissions, users } from "../db/schema";
import { createCaller, error$ } from "@solid-mediakit/prpc";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export const getOtherUsers = createCaller(async ({ session$ }) => {
    "use server";
    if (!session$ || !session$.user || session$.user.role !== "ADMIN") {
        return error$("unauthorised", {
            status: 403,
        });
    }

    const otherUsers = await db
        .select()
        .from(users)
        .where(sql`${users.id} != ${session$.user.id}`);

    return otherUsers;
});

export const getUser = createCaller(
    z.object({
        id: z.string(),
    }),
    async ({ input$, session$ }) => {
        "use server";
        if (!session$ || !session$.user || session$.user.role !== "ADMIN") {
            return error$("unauthorised", {
                status: 403,
            });
        }

        const user = (
            await db
                .select()
                .from(users)
                .where(eq(users.id, input$.id))
                .limit(1)
        )[0];

        if (!user)
            return error$("not found", {
                status: 404,
            });

        return user;
    },
    {
        cache: false,
    }
);

export const togglePermission = createCaller(
    z.object({
        userId: z.string(),
        permission: z.enum(permissions),
    }),
    async ({ input$, session$ }) => {
        "use server";
        if (!session$ || !session$.user || session$.user.role !== "ADMIN") {
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
