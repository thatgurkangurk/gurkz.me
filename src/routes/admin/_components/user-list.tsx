import { UserCard } from "./user-card";
import { Show, For } from "solid-js";
import { getOtherUsers } from "~/server/admin/user";

export function UserList() {
    const otherUsers = getOtherUsers();

    return (
        <Show when={otherUsers.data}>
            {(users) => (
                <For each={users()} fallback={<p>no other users exist</p>}>
                    {(user) => <UserCard user={user} />}
                </For>
            )}
        </Show>
    );
}
