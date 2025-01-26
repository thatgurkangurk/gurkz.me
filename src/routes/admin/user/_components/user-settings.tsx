import { Session } from "@auth/core/types";
import { For, Show } from "solid-js";
import { MusicCard } from "~/components/music/music-card";
import { Button } from "~/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Permission, permissionsSchema } from "~/lib/permissions";
import { getMusicIdsByUser } from "~/server/admin/music";
import { getUser, togglePermission } from "~/server/admin/user";

function PermissionRow(props: {
    user: Session["user"];
    permission: Permission;
}) {
    const getUserUtils = getUser.useUtils();
    const { mutate } = togglePermission(() => ({
        async onSettled() {
            await getUserUtils.invalidate({
                id: props.user.id,
            });
        },
    }));
    return (
        <TableRow>
            <TableCell class="font-medium">{props.permission}</TableCell>
            <TableCell>
                {props.user.permissions.includes(props.permission)
                    ? "yes"
                    : "no"}
            </TableCell>
            <TableCell>
                <Button
                    onClick={() => {
                        mutate({
                            userId: props.user.id,
                            permission: props.permission,
                        });
                    }}
                >
                    {props.user.permissions.includes(props.permission)
                        ? "disable"
                        : "enable"}
                </Button>
            </TableCell>
        </TableRow>
    );
}

function MusicIdsByUser(props: { user: Session["user"] }) {
    // eslint-disable-next-line solid/reactivity -- this is how the library works (i can't change it)
    const musicIds = getMusicIdsByUser(() => ({
        userId: props.user.id,
    }));
    return (
        <>
            <Show
                when={musicIds.data && musicIds.data.length !== 0}
                fallback={<p>this user haven't created any music ids</p>}
            >
                <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <For each={musicIds.data}>
                        {(musicId) => <MusicCard musicId={musicId} />}
                    </For>
                </div>
            </Show>
        </>
    );
}

export function UserSettings(props: { user: Session["user"] }) {
    return (
        <>
            <h2 class="text-2xl">user settings for {props.user.name}</h2>

            <h3 class="text-xl pt-2">user permissions</h3>

            <Table class="w-fit">
                <TableHeader>
                    <TableRow>
                        <TableHead>Permission</TableHead>
                        <TableHead>Has permission</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <For each={permissionsSchema.options}>
                        {(permission) => (
                            <PermissionRow
                                permission={permission}
                                user={props.user}
                            />
                        )}
                    </For>
                </TableBody>
            </Table>

            <h3 class="text-xl pt-2">user's music ids</h3>
            <MusicIdsByUser user={props.user} />
        </>
    );
}
