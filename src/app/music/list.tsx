"use client";

import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MusicCard } from "./music-card";

export function MusicList() {
  const { data } = useSuspenseQuery(orpc.music.get.queryOptions());

  return (
    <div className="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {data &&
        data.map((musicId) => (
          <MusicCard musicId={musicId} key={musicId.robloxId} />
        ))}
    </div>
  );
}
