import { createCaller } from "@solid-mediakit/prpc";
import { db } from "./db";
import { eq } from "drizzle-orm";

export const getPermissions = createCaller(async ({ session$ }) => {
  if (!session$) return null;

  const dbUser = await db.query.users.findFirst({
    where: (table) => eq(table.id, session$.user.id),
  });

  if (!dbUser) return null;

  return dbUser.permissions;
});
