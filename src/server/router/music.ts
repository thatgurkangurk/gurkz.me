import { db } from "@/lib/db";
import { base } from "../orpc";
import { schema } from "@/app/music/create/schema";
import { requireAuthMiddleware } from "../middleware/auth";
import { hasPermission } from "@/lib/permissions";
import { ORPCError } from "@orpc/server";
import { musicIds } from "@/lib/db/schema/music";

const getMusicIds = base.handler(async () => {
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
});

const createMusicId = base
  .input(schema)
  .use(requireAuthMiddleware)
  .handler(async ({ context, input }) => {
    const { user } = context.session;
    if (!hasPermission(user, "CREATE_MUSIC_IDS"))
      throw new ORPCError("FORBIDDEN");

    await context.db
      .insert(musicIds)
      .values({
        verified: hasPermission(user, "CREATE_AUTO_VERIFIED_MUSIC_IDS")
          ? true
          : false,
        createdById: user.id,
        name: input.name,
        robloxId: input.robloxId,
        tags: input.tags,
      })
      .catch((err) => {
        console.error(err);
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "could not create the music id",
        });
      });

    return {
      text: "successfully created the music id",
      type: "success",
    };
  });

export const musicRouter = {
  get: getMusicIds,
  create: createMusicId,
};
