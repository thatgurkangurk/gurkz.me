import { UserSettings } from "./_components/user-settings";
import { protected$ } from "@solid-mediakit/auth";
import { A, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { getUser } from "~/server/admin/user";

export default protected$(() => {
    const params = useParams<{ id: string }>();
    const userQuery = getUser(() => ({
        id: params.id,
    }));

    return (
        <>
            <Button as={A} href="/admin">
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
