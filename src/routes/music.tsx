import { FieldInfo } from "@/components/form/field-info";
import { useAppForm } from "@/components/music/form/hooks";
import { formOpts } from "@/components/music/form/options";
import { FormatSelector } from "@/components/music/format-selector";
import { idFormatAtom, idFormatSchema } from "@/components/music/id-format";
import { MusicCard } from "@/components/music/music-card";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import { hasPermission } from "@/lib/permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { useHydrateAtoms } from "jotai/utils";
import Cookies from "js-cookie";
import { lazy, Suspense } from "react";

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
    return {
      initialIdFormat: getInitialIdFormat(),
    };
  },
  head: () => ({
    meta: [
      {
        title: "music id list - gurkan's website",
      },
    ],
  }),
});

const CreateMusicIdForm = lazy(() =>
  import("@/components/music/form/form").then((module) => ({
    default: module.CreateMusicIdForm,
  }))
);

function RouteComponent() {
  const { data: musicIds } = useQuery(orpc.music.get.queryOptions());
  const { data: session } = useQuery(orpc.session.get.queryOptions());
  const { initialIdFormat } = Route.useLoaderData();

  useHydrateAtoms([[idFormatAtom, initialIdFormat]]);

  return (
    <>
      <h1 className="text-3xl">music id list</h1>
      <FormatSelector />

      {session && hasPermission(session.user, "CREATE_MUSIC_IDS") && (
        <Suspense>
          <CreateMusicIdForm />
        </Suspense>
      )}

      <div className="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {musicIds?.map((musicId) => (
          <MusicCard key={musicId.id} musicId={musicId} />
        ))}
      </div>
    </>
  );
}
