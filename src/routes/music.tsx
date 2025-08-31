import { FormatSelector } from "@/components/music/format-selector";
import { idFormatAtom, idFormatSchema } from "@/components/music/id-format";
import { MusicCard } from "@/components/music/music-card";
import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { useHydrateAtoms } from "jotai/utils";
import Cookies from "js-cookie";

export const getInitialIdFormat = createIsomorphicFn()
  .server(() => {
    const raw = getCookie("id_format");
    try {
      return idFormatSchema.parse(raw);
    } catch {
      return "DEFAULT";
    }
  })
  .client(async () => {
    const raw = Cookies.get("id_format");
    try {
      return idFormatSchema.parse(raw);
    } catch {
      return "DEFAULT";
    }
  });

export const Route = createFileRoute("/music")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.music.get.queryOptions());
    return getInitialIdFormat();
  },
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
  const cookie = Route.useLoaderData();

  useHydrateAtoms([[idFormatAtom, cookie]]);

  return (
    <>
      <h1 className="text-3xl">music id list</h1>
      <FormatSelector />
      <div className="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {data?.map((musicId) => (
          <MusicCard key={musicId.id} musicId={musicId} />
        ))}
      </div>
    </>
  );
}
