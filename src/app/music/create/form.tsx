"use client";

import { orpc } from "@/lib/orpc";
import { hasPermission } from "@/lib/permissions";
import { useSuspenseQuery } from "@tanstack/react-query";

function Form() {
  return (
    <>
      <p>creating music ids is coming soon</p>
    </>
  );
}

export function CreateMusicIdForm() {
  const { data } = useSuspenseQuery(orpc.session.get.queryOptions());
  return (
    <>
      {data && data?.user && hasPermission(data.user, "DEFAULT") ? (
        <>
          <Form />
        </>
      ) : null}
    </>
  );
}
