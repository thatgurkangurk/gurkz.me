import { UserList } from "./_components/user-list";
import { createAsync, RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { Title } from "~/components/title";
import { auth } from "~/lib/auth/actions";
import { isAdminQuery } from "~/server/admin/admin";

export const route = {
    preload: () => isAdminQuery(),
} satisfies RouteDefinition;

export default function () {
    const user = createAsync(() => auth());
    return (
        <Show when={user()}>
            {(user) => (
                <>
                    <Title>admin</Title>
                    <h1 class="text-3xl">welcome to admin, {user().name}!</h1>

                    <div>
                        <h2 class="text-2xl">user management</h2>
                        <UserList />
                    </div>
                </>
            )}
        </Show>
    );
}
