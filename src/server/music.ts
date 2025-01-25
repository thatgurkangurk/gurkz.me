import { db } from "./db";
import { createCaller } from "@solid-mediakit/prpc";

const getMusicIds = createCaller(
    async () => {
        "use server";
        const musicIds = await db.query.musicIds.findMany({
            with: {
                creator: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: (table, { desc }) => desc(table.created),
        });
        return musicIds;
    },
    {
        cache: true,
    }
);

export { getMusicIds };
