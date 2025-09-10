"use client";

import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment } from "react";

export function MusicList() {
  const { data } = useSuspenseQuery(orpc.music.get.queryOptions());

  return (
    <div>
      {data &&
        data.map((musicId) => (
          <Fragment key={musicId.id}>
            <p>
              {musicId.name} - {musicId.robloxId}
            </p>
          </Fragment>
        ))}
    </div>
  );
}
