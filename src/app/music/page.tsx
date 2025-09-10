import { getQueryClient } from "@/lib/get-query-client";
import { orpc } from "@/lib/orpc";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MusicList } from "./list";
import { CreateMusicIdForm } from "./create/form";
import { FormatSelector } from "./format-selector";
import { cookies } from "next/headers";
import { idFormatSchema } from "./id-format";

async function getInitialIdFormat() {
  const cookieStore = await cookies();
  const value = cookieStore.get("id_format")?.value;
  const idFormatFromServer = await idFormatSchema.safeParseAsync(value);
  if (idFormatFromServer.error) {
    return idFormatSchema.def.defaultValue;
  }
  return idFormatFromServer.data;
}

export default async function MusicPage() {
  const idFormatFromServer = await getInitialIdFormat();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(orpc.music.get.queryOptions());

  return (
    <>
      <CreateMusicIdForm />
      <FormatSelector idFormatFromServer={idFormatFromServer} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MusicList />
      </HydrationBoundary>
    </>
  );
}
