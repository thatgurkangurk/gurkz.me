import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/server/db";

const getMusicIds = createServerFn({ method: "GET" }).handler(async () => {
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

export const Route = createFileRoute("/music")({
  component: RouteComponent,
  loader: () => getMusicIds(),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <div>
      music id list
      {data.map((musicId) => (
        <div key={musicId.id}>
          <p>
            {musicId.name} - s/{musicId.robloxId}
          </p>
        </div>
      ))}
    </div>
  );
}
