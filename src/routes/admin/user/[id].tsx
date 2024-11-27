import { protected$ } from "@solid-mediakit/auth";
import { RouteDefinition, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { Button } from "~/lib/components/ui/button";
import { isAdminQuery } from "~/lib/server/admin";
import { getUser } from "~/lib/server/user";
import { UserSettings } from "./_components/user-settings";

export const route = {
  preload: () => isAdminQuery(),
} satisfies RouteDefinition;

export default protected$((session$) => {
  const params = useParams<{
    id: string;
  }>();
  const userQuery = getUser(() => ({
    id: params.id,
  }));
  return (
    <>
      <Button as="a" href="/admin">
        go back
      </Button>
      <Show
        when={userQuery.data}
        fallback={
          <div>
            <p>no user was found</p>
            <Button as="a" href="/admin">
              go back
            </Button>
          </div>
        }
      >
        {(user) => <UserSettings user={user()} />}
      </Show>
    </>
  );
});
