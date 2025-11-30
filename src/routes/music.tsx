import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { MusicCard } from "~/components/music/music-card";
import { orpc } from "~/lib/orpc";
import { getServerSession } from "~/lib/session";

export const Route = createFileRoute("/music")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getServerSession();

    if (!session?.user)
      throw redirect({
        to: "/login",
        search: {
          redirectTo: "/music",
        },
      });

    if (!session.user.permissions.includes("VIEW_MUSIC_IDS"))
      throw redirect({
        to: "/unauthorised",
        search: {
          redirectTo: "/music",
        },
      });
  },
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(orpc.music.list.queryOptions());
  },
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
