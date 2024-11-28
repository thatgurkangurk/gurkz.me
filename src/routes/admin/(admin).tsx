import { UserCard } from "./_components/user-card";
import { protected$ } from "@solid-mediakit/auth";
import { RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { isAdminQuery } from "~/lib/server/admin";
import { getOtherUsers } from "~/lib/server/user";

export const route = {
    preload: () => isAdminQuery(),
} satisfies RouteDefinition;

export default protected$((session$) => {
    const otherUsers = getOtherUsers();
    return (
        <>
            <p>
                hi, {session$.user.name}. your role is {session$.user.role}
            </p>

            <div>
                <h2 class="text-2xl">user management</h2>
                <Show when={otherUsers.data}>
                    {(users) => (
                        <For
                            each={users()}
                            fallback={<p>no other users exist</p>}
                        >
                            {(user) => <UserCard user={user} />}
                        </For>
                    )}
                </Show>
            </div>
        </>
    );
});
