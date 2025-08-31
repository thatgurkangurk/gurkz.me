import { hasPermission } from "@/lib/permissions";
import { requireAuthMiddleware } from "../middleware/auth";
import { or } from "../orpc";
import { MusicIdWithCreator } from "@/lib/schemas/music";
import { ORPCError } from "@orpc/client";
import { musicIds } from "@/lib/db/schema/music";
import { schema } from "@/components/music/form/schema";

export const getMusicIds = or
  .route({ method: "GET" })
  .output(MusicIdWithCreator.array())
  .handler(async ({ context }) => {
    const ids = await context.db.query.musicIds.findMany({
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

    return ids;
  });

export const createMusicId = or
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
