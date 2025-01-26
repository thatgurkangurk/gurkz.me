import { UserList } from "./_components/user-list";
import { protected$ } from "@solid-mediakit/auth";
import { RouteDefinition } from "@solidjs/router";
import { Title } from "~/components/title";
import { isAdminQuery } from "~/server/admin/admin";

export const route = {
    preload: () => isAdminQuery(),
} satisfies RouteDefinition;

export default protected$(
    (session$) => {
        return (
            <>
                <Title>admin</Title>
                <h1 class="text-3xl">
                    welcome to admin, {session$.user.name}!
                </h1>

                <div>
                    <h2 class="text-2xl">user management</h2>
                    <UserList />
                </div>
            </>
        );
    },
    () => <p>you need to sign in to continue</p>
);
