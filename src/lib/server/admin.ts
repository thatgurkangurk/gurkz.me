import { getSession } from "@solid-mediakit/auth";
import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { authOpts } from "../auth";

export const isAdminQuery = query(async () => {
  "use server";
  const event = getRequestEvent()!;
  const session = await getSession(event, authOpts);

  if (session?.user.role !== "ADMIN") throw redirect("/");

  return true;
}, "is-admin");
