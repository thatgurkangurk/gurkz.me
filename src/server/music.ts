import { db } from "./db";
import { createCaller } from "@solid-mediakit/prpc";

const getMusicIds = createCaller(
    async () => {
        "use server";
        const musicIds = await db.query.musicId.findMany();
        return musicIds;
    },
    {
        cache: false,
    }
);

export { getMusicIds };
