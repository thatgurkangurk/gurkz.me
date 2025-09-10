import { db } from "@/lib/db";
import { base } from "../orpc";

const getMusicIds = base.handler(async () => {
  return db.query.musicIds.findMany({
    columns: {
      id: true,
      name: true,
      robloxId: true,
      createdById: true,
      created: true,
      working: true,
      verified: true,
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
});

export const musicRouter = {
  get: getMusicIds,
};
