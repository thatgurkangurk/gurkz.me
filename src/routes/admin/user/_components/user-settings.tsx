import { For } from "solid-js";
import { Button } from "~/lib/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/lib/components/ui/table";
import { Permission, permissions } from "~/lib/db/schema";
import { getUser, togglePermission } from "~/lib/server/user";
import { User } from "~/lib/user";

function PermissionRow(props: { user: User; permission: Permission }) {
  const getUserUtils = getUser.useUtils();
  const { mutate } = togglePermission(() => ({
    async onSettled() {
      console.log("RAHH");
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
    </>
  );
}
