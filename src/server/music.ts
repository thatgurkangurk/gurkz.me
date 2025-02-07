import { db } from "./db";
import { createCaller } from "@solid-mediakit/prpc";
import { z } from "zod";

async function getMusicIdsFromDb(verifiedOnly: boolean) {
    "use server";
    if (verifiedOnly)
        return await db.query.musicIds.findMany({
            with: {
                creator: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            where: (table, { eq }) => eq(table.verified, true),
            orderBy: (table, { desc }) => desc(table.created),
        });

    return await db.query.musicIds.findMany({
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
}

const getMusicIds = createCaller(
    z.boolean().default(true),
    async ({ input$ }) => {
        "use server";
        return await getMusicIdsFromDb(input$);
    },
    {
        cache: false,
        method: "GET",
    }
);

export { getMusicIds };
