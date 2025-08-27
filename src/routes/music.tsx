import { MusicCard } from "@/components/music/music-card";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/music")({
  component: RouteComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(orpc.music.get.queryOptions()),
  head: () => ({
    meta: [
      {
        title: "music id list - gurkan's website",
      },
    ],
  }),
});

function RouteComponent() {
  const { data } = useQuery(orpc.music.get.queryOptions());
  return (
    <>
      <h1 className="text-3xl">music id list</h1>
      <div className="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {data?.map((musicId) => (
          <MusicCard key={musicId.id} musicId={musicId} />
        ))}
      </div>
    </>
  );
}
