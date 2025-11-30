import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MusicCard } from "~/components/music/music-card";
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
      <div className="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {data.map((musicId) => (
          <MusicCard key={musicId.id} musicId={musicId} />
        ))}
      </div>
    </div>
  );
}
