import { getQueryClient } from "@/lib/get-query-client";
import { orpc } from "@/lib/orpc";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MusicList } from "./list";

export default function MusicPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(orpc.getMusicIds.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MusicList />
    </HydrationBoundary>
  );
}
