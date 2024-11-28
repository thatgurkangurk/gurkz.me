import { For, Show } from "solid-js";
import { MusicCard } from "~/lib/components/music/music-card";
import { Button } from "~/lib/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { Permission, permissions } from "~/lib/db/schema";
import { getMusicIdsByUser } from "~/lib/server/music";
import { getUser, togglePermission } from "~/lib/server/user";
import { User } from "~/lib/user";

function PermissionRow(props: { user: User; permission: Permission }) {
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
        {props.user.permissions.includes(props.permission) ? "yes" : "no"}
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

function MusicIdsByUser(props: { user: User }) {
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

export function UserSettings(props: { user: User }) {
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
          <For each={permissions}>
            {(permission) => (
              <PermissionRow permission={permission} user={props.user} />
            )}
          </For>
        </TableBody>
      </Table>

      <h3 class="text-xl pt-2">user's music ids</h3>
      <MusicIdsByUser user={props.user} />
    </>
  );
}
