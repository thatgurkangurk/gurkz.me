import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import * as cookie from "cookie";
import { useHydrateAtoms } from "jotai/utils";
import { CreateMusicIdForm } from "~/components/music/create-form";
import { idFormat, idFormatSchema } from "~/components/music/format";
import { FormatSelector } from "~/components/music/format-selector";
import { MusicCard } from "~/components/music/music-card";
import { orpc } from "~/lib/orpc";
import { Check } from "~/lib/permix";
import { getServerSession } from "~/lib/session";
import { AlertCircleIcon } from "lucide-react";

const getInitialIdFormat = createIsomorphicFn()
  .server(() => {
    const raw = getCookie("id_format");
    try {
      return idFormatSchema.parse(raw);
    } catch {
      return "DEFAULT";
    }
  })
  .client(() => {
    const raw = cookie.parse(document.cookie).id_format;
    try {
      return idFormatSchema.parse(raw);
    } catch {
      return "DEFAULT";
    }
  });

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
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(orpc.music.list.queryOptions());
    return {
      initialIdFormat: getInitialIdFormat(),
    };
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(orpc.music.list.queryOptions());
  const { initialIdFormat } = Route.useLoaderData();

  useHydrateAtoms([[idFormat, initialIdFormat]]);

  return (
    <div>
      music id list
      <Check entity={"musicId"} action={"create"}>
        <CreateMusicIdForm />
      </Check>
      <FormatSelector />
      <br />
      <div className="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {data.map((musicId) => (
          <MusicCard key={musicId.id} musicId={musicId} />
        ))}
      </div>
    </div>
  );
}
