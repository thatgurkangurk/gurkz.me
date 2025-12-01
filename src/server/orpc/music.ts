import { formSchema } from "~/components/music/form-options";
import { db } from "../db";
import { or } from "../orpc";
import { protectedMiddleware } from "../permix";
import { ResultAsync } from "neverthrow";
import { musicIds } from "../db/schema/music";
import { ORPCError } from "@orpc/client";
import { orpcPermix } from "~/server/permix";
import { permix } from "~/lib/permix";
import * as z from "zod/v4";
import { eq } from "drizzle-orm";

const listMusicIds = protectedMiddleware
  .use(orpcPermix.checkMiddleware("musicId", "view"))
  .route({ method: "GET" })
  .handler(async () => {
    const ids = await db.query.musicIds.findMany({
      columns: {
        id: true,
        name: true,
        robloxId: true,
        createdById: true,
        created: true,
        working: true,
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

const createMusicId = protectedMiddleware
  .use(orpcPermix.checkMiddleware("musicId", "create"))
  .route({ method: "POST" })
  .input(formSchema)
  .handler(async ({ context, input }) => {
    const user = context.session?.user;

    if (!user) throw new ORPCError("UNAUTHORIZED");

    const result = await ResultAsync.fromPromise(
      db.insert(musicIds).values({
        createdById: user.id,
        name: input.name,
        robloxId: input.robloxId,
        tags: input.tags,
      }),
      (error) => ({
        type: "db",
        error: error instanceof Error ? error : new Error(String(error)),
      })
    );

    if (result.isErr()) {
      console.error("failed to create music id", result.error.error.message);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "could not create the music id",
      });
    }

    return {
      text: "successfully created the music id",
      type: "success",
    };
  });

const deleteMusicId = protectedMiddleware
  .route({ method: "DELETE" })
  .input(
    z.object({
      id: z.ulid(),
    })
  )
  .handler(async ({ context, input }) => {
    const user = context.session?.user;

    if (!user) throw new ORPCError("UNAUTHORIZED");

    const musicIdToDelete = await context.db.query.musicIds.findFirst({
      where: (table, { eq }) => eq(table.id, input.id),
    });

    if (!musicIdToDelete) throw new ORPCError("NOT_FOUND");

    const permissionCheck = permix.check("musicId", "delete", musicIdToDelete);

    if (!permissionCheck) throw new ORPCError("FORBIDDEN");

    const result = await ResultAsync.fromPromise(
      context.db.delete(musicIds).where(eq(musicIds.id, musicIdToDelete.id)),
      (error) => ({
        type: "db",
        error: error instanceof Error ? error : new Error(String(error)),
      })
    );

    if (result.isErr()) {
      console.error("failed to delete music id", result.error.error.message);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "could not delete the music id",
      });
    }

    return {
      text: "successfully deleted the music id",
      type: "success",
    };
  });

export const musicRouter = or.router({
  list: listMusicIds,
  create: createMusicId,
  delete: deleteMusicId,
});
