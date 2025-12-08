import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { auth, type User } from "~/server/auth";
import * as z from "zod/v4";
import { zodValidator } from "@tanstack/zod-adapter";
import { getServerSession } from "~/lib/session";
import { getRequest } from "@tanstack/react-start/server";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { authClient } from "~/lib/auth";
import { Button } from "~/components/ui/button";

const checkIfUserExists = createServerFn({ method: "GET" })
  .inputValidator(zodValidator(z.object({ id: z.string() })))
  .handler(async (ctx) => {
    const res = await auth.api.getUser({
      query: {
        id: ctx.data.id,
      },
      headers: getRequest().headers,
    });

    if (!res)
      return {
        exists: false,
        data: null,
      };

    return {
      exists: true,
      data: res as User,
    };
  });

function getUserOptions(id: string) {
  return queryOptions({
    queryKey: ["admin", "get-user", id],
    queryFn: async () => {
      const res = await authClient.admin.getUser({
        query: {
          id: id,
        },
      });

      if (res.error) throw res.error;

      return res.data as User;
    },
  });
}

export const Route = createFileRoute("/admin/user/$userId")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getServerSession();

    if (session?.user.role !== "admin")
      throw redirect({
        to: "/",
      });
  },
  loader: async (ctx) => {
    const res = await checkIfUserExists({
      data: {
        id: ctx.params.userId,
      },
    });

    if (!res.exists) throw notFound();

    ctx.context.queryClient.setQueryData(
      getUserOptions(res.data.id).queryKey,
      res.data
    );
  },
});

function RouteComponent() {
  const { userId } = Route.useParams();
  const { data } = useSuspenseQuery(getUserOptions(userId));
  return (
    <div>
      <Button>
        <Link to="/admin">back</Link>
      </Button>
      <br />
      {data.name}
      <p>coming soon</p>
    </div>
  );
}
