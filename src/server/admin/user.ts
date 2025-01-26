import { db } from "../db";
import { users } from "../db/schema";
import { createCaller, error$ } from "@solid-mediakit/prpc";
import { sql } from "drizzle-orm";

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
