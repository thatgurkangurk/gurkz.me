import { hasPermission } from "@/lib/permissions";
import { requireAuthMiddleware } from "../middleware/auth";
import { or } from "../orpc";
import { MusicIdWithCreator, UpdateMusicIdInput } from "@/lib/schemas/music";
import { ORPCError } from "@orpc/client";
import { musicIds } from "@/lib/db/schema/music";
import { schema } from "@/components/music/form/schema";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";

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

export const deleteMusicId = or
  .route({ method: "DELETE" })
  .input(
    z.object({
      id: z.ulid(),
    })
  )
  .use(requireAuthMiddleware)
  .handler(async ({ context, input }) => {
    const { session, db } = context;
    const [musicIdToDelete] = await db
      .select()
      .from(musicIds)
      .where(eq(musicIds.id, input.id))
      .limit(1);

    if (!musicIdToDelete)
      throw new ORPCError("NOT_FOUND", {
        message: `Music ID ${input.id} not found`,
      });

    const canManage =
      !!session?.user &&
      (session.user.id === musicIdToDelete.createdById ||
        hasPermission(session.user, "MANAGE_MUSIC_IDS"));

    if (!canManage)
      throw new ORPCError("FORBIDDEN", {
        message: "you are not allowed to do that",
      });

    try {
      await db.delete(musicIds).where(eq(musicIds.id, input.id));
    } catch (err) {
      console.error("FAILED TO DELETE", err);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return {
      success: true,
    };
  });

export const editMusicId = or
  .input(UpdateMusicIdInput)
  .use(requireAuthMiddleware)
  .route({ method: "PATCH" })
  .handler(async ({ input, context }) => {
    const { session, db } = context;
    const { id, ...updates } = input;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    const [musicIdToEdit] = await db
      .select()
      .from(musicIds)
      .where(eq(musicIds.id, id))
      .limit(1);

    if (!musicIdToEdit)
      throw new ORPCError("NOT_FOUND", {
        message: `Music ID ${id} not found`,
      });

    const isOwner = session?.user?.id === musicIdToEdit.createdById;
    const isManager =
      !!session?.user && hasPermission(session.user, "MANAGE_MUSIC_IDS");

    if (
      "verified" in cleanUpdates &&
      cleanUpdates.verified !== musicIdToEdit.verified &&
      !isManager
    ) {
      throw new ORPCError("FORBIDDEN", {
        message: "you are not allowed to change the verified status",
      });
    }

    if (!(isOwner || isManager)) {
      throw new ORPCError("FORBIDDEN", {
        message: "you are not allowed to do that",
      });
    }

    try {
      await db.update(musicIds).set(cleanUpdates).where(eq(musicIds.id, id));
    } catch (err) {
      console.error("FAILED TO UPDATE", err);
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return {
      success: true,
    };
  });
