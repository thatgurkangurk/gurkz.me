import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpc } from "~/lib/orpc";

export const Route = createFileRoute("/music")({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(orpc.music.list.queryOptions()),
});

function RouteComponent() {
  const { data } = useSuspenseQuery(orpc.music.list.queryOptions());

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
