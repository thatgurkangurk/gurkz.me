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
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { authClient } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Permission, permissions } from "~/lib/permissions";
import { Field, FieldGroup, FieldSet } from "~/components/ui/field";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

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

function UserPermissionsSelector({
  user,
}: Readonly<{
  user: User;
}>) {
  const queryClient = useQueryClient();
  const form = useForm({
    onSubmit: async ({ value, formApi }) => {
      console.log(value.permissions);
      const res = await authClient.admin.updateUser({
        userId: user.id,
        data: {
          /**
           * this uses my REALLY STUPID patch in drizzle orm for a bug in better-auth
           * basically, authClient.admin.updateUser seemed to send ["DEFAULT"] (for example) as a type "string"
           * and it was quite hard to find a place to patch this into better-auth, so i just added this special version into drizzle
           * */
          permissions: `[convertThisToAStringArrayPlease]:${value.permissions.join(",")}`,
        },
      });

      if (res.error) {
        toast.error("something went wrong", {
          description: res.error.message,
        });
        console.error(res.error);
        return;
      }

      const newUser = res.data as User;

      formApi.setFieldValue(
        "permissions",
        () => newUser.permissions as Permission[]
      );

      await queryClient.invalidateQueries(getUserOptions(user.id));
    },
    defaultValues: {
      permissions: user.permissions as Permission[],
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        mode="array"
        name="permissions"
        children={(arrayField) => (
          <FieldSet>
            <FieldGroup data-slot="checkbox-group">
              {permissions.map((permission, i) => (
                <form.Field
                  key={permission}
                  name={`permissions[${i}]`}
                  children={(field) => {
                    const checked = arrayField.state.value.includes(permission);
                    return (
                      <Field orientation="horizontal">
                        <Checkbox
                          id={`form-permission-checkbox-${permission}`}
                          checked={checked}
                          name={field.name}
                          onCheckedChange={(checked) => {
                            arrayField.setValue((prev) =>
                              checked
                                ? [...prev, permission]
                                : prev.filter((p) => p !== permission)
                            );
                          }}
                        />
                        {permission}
                      </Field>
                    );
                  }}
                ></form.Field>
              ))}
            </FieldGroup>
          </FieldSet>
        )}
      />
      <form.Subscribe selector={(state) => [state.isValid, state.isSubmitting]}>
        {([isValid, isPending]) => (
          <Button disabled={isPending || !isValid}>
            {isPending && <LoaderCircle className="animate-spin" />} save
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
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
      <h1 className="text-3xl">managing "{data.name}"</h1>

      <br />
      <p>user permissions:</p>
      <UserPermissionsSelector user={data} />
    </div>
  );
}
