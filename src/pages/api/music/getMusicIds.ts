import { defineApiRoute } from "astro-typed-api/server";
import { prisma } from "~/db";

export const getMusicIds = defineApiRoute({
    fetch: async () => {
        return await prisma.musicId.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
});

export const GET = getMusicIds;
