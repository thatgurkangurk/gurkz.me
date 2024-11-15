import { query } from "@solidjs/router";
import { db } from "./db";

export const getMusicIds = query(async () => {
    "use server";
    const musicIds = await db.query.musicIds.findMany();
    return musicIds;
}, "music_ids");