import { os } from "@orpc/server";
import { db } from "../db";

export const listMusicIds = os.handler(async () => {
    const musicIds = await db.query.musicIds.findMany({
        columns: {
            id: true,
            name: true,
            robloxId: true,
            createdById: true,
            createdAt: true,
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

    return musicIds;
});

export const musicRouter = {
    list: listMusicIds,
};
