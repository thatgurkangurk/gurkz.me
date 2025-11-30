import { db } from "../db";
import { or } from "../orpc";

const listMusicIds = or.route({ method: "GET" }).handler(async () => {
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

export const musicRouter = {
  list: listMusicIds,
};
