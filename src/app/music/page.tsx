import { getQueryClient } from "@/lib/get-query-client";
import { orpc } from "@/lib/orpc";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MusicList } from "./list";
import { CreateMusicIdForm } from "./create/form";

export default async function MusicPage() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(orpc.session.get.queryOptions());
  void queryClient.prefetchQuery(orpc.music.get.queryOptions());

  return (
    <>
      <CreateMusicIdForm />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MusicList />
      </HydrationBoundary>
    </>
  );
}
