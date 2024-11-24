import { createCaller } from "@solid-mediakit/prpc";
import { db } from "./db";

export const getMusicIds = createCaller(
    async () => {
        "use server";
        const musicIds = await db.query.musicIds.findMany();
        return musicIds;
    },
    {
        method: "GET",
    }
);
