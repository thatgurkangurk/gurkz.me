import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { os } from "@orpc/server";
import { cookies, headers } from "next/headers";

const base = os.use(async ({ next }) =>
  next({
    context: {
      headers: await headers(),
      cookies: await cookies(),
      session: await auth.api.getSession({
        headers: await headers(),
      }),
    },
  })
);

const router = {
  getMusicIds: base.handler(async () => {
    return db.query.musicIds.findMany({
      columns: {
        id: true,
        name: true,
        robloxId: true,
        createdById: true,
        created: true,
        working: true,
        verified: true,
        tags: true,
      },
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: ({ id }, { desc }) => desc(id),
    });
  }),
};

export { router };
