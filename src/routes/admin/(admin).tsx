import { getSession, protected$ } from "@solid-mediakit/auth";
import { query, redirect, RouteDefinition } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { authOpts } from "~/lib/auth";

const isAdminQuery = query(async () => {
  "use server";
  const event = getRequestEvent()!;
  const session = await getSession(event, authOpts);

  if (session?.user.role !== "ADMIN") throw redirect("/");

  return true;
}, "is-admin");

export const route = {
  preload: () => isAdminQuery(),
} satisfies RouteDefinition;

export default protected$((session$) => {
  return (
    <p>
      hi, {session$.user.name}. your role is {session$.user.role}
    </p>
  );
});
