import { db } from "~/server/db";

export async function GET() {
    const ids = await db.query.musicIds.findMany({
        columns: {
            id: true,
            name: true,
            robloxId: true,
            working: true,
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
    });

    return ids;
}
