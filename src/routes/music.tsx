import { orpc } from "@/lib/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";

export const Route = createFileRoute("/music")({
  component: RouteComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData(orpc.music.get.queryOptions()),
});

function RouteComponent() {
  const { data } = useQuery(orpc.music.get.queryOptions());
  return (
    <>
      {data?.map((musicId) => (
        <Fragment key={musicId.id}>
          <p>
            {musicId.name} - {musicId.robloxId}
          </p>
        </Fragment>
      ))}
    </>
  );
}
