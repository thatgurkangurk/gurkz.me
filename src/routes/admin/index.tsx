import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { authClient } from "~/lib/auth";
import { getServerSession } from "~/lib/session";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { LoaderCircleIcon } from "lucide-react";
import { User } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { UserAvatar } from "@daveyplate/better-auth-ui";

const listAllUsersQuery = queryOptions({
  queryKey: ["admin", "list-users"],
  queryFn: async () => {
    const res = await authClient.admin.listUsers({
      query: {},
    });

    if (res.error) throw res.error;

    return res.data as NonNullable<
      | {
          users: User[];
          total: number;
          limit: number | undefined;
          offset: number | undefined;
        }
      | {
          users: never[];
          total: number;
        }
    >;
  },
});

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const session = await getServerSession();

    if (session?.user.role !== "admin")
      throw redirect({
        to: "/",
      });
  },
  component: RouteComponent,
});

function UserCard({
  user,
}: Readonly<{
  user: User;
}>) {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-xl flex gap-2 items-center">
          <UserAvatar user={user} /> {user.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-md flex items-center gap-2">
          permissions: {user.permissions.join(", ")}
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-1">
        <p>
          role: <span> {user.role}</span>
        </p>
        <Link
          className="w-fit"
          to="/admin/user/$userId"
          params={{
            userId: user.id,
          }}
        >
          <Button>manage</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function UsersList() {
  const { data: allUsers, isPending } = useQuery(listAllUsersQuery);

  if (isPending)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderCircleIcon className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>loading all users</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );

  return (
    <div className="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
      {allUsers?.users.map((user: User) => (
        <UserCard user={user} key={user.id} />
      ))}
    </div>
  );
}

function RouteComponent() {
  return (
    <div>
      <div className="p-2">
        <UsersList />
      </div>
    </div>
  );
}
