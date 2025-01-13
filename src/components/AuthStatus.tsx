import { Show } from "solid-js";
import { signIn, signOut, useSession } from "~/lib/auth/client";

export function AuthStatus() {
    const session = useSession();

    return (
        <>
            <Show
                when={session().data}
                fallback={
                    <div class="flex flex-gap gap-2">
                        <p>not logged in</p>
                        <button
                            onClick={() =>
                                signIn.social({
                                    provider: "discord",
                                })
                            }
                        >
                            log in
                        </button>
                    </div>
                }
            >
                {(data) => (
                    <div class="flex flex-gap gap-2">
                        <p>hello, {data().user.name}</p>
                        <button onClick={() => signOut()}>log out</button>
                    </div>
                )}
            </Show>
        </>
    );
}
