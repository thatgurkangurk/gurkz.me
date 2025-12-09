import {
  createFileRoute,
  Link,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { userSchema, type User } from "~/lib/auth";
import { auth } from "~/server/auth";
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
import { requireAdminMiddleware } from "~/server/admin";
import { ResultAsync } from "neverthrow";
import { db } from "~/server/db";
import { user } from "~/server/db/schema/auth";
import { eq } from "drizzle-orm";

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

const updateUser = createServerFn({ method: "POST" })
  .inputValidator(
    zodValidator(
      z.object({
        userId: z.string(),
        data: userSchema.omit({ id: true }).partial(),
      })
    )
  )
  .middleware([requireAdminMiddleware])
  .handler(async ({ data }) => {
    const result = await ResultAsync.fromPromise<User[], Error>(
      db
        .update(user)
        .set(data.data)
        .where(eq(user.id, data.userId))
        .returning(),
      (e) => e as Error
    );

    if (result.isErr()) {
      return { success: false, error: result.error.message };
    }

    return { success: true, user: result.value[0] };
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
      const res = await updateUser({
        data: {
          userId: user.id,
          data: {
            permissions: value.permissions,
          },
        },
      });

      if (!res.success) {
        toast.error("something went wrong", {
          description: res.error,
          position: "top-center",
        });
        console.error(res.error);
        return;
      }

      formApi.setFieldValue(
        "permissions",
        () => res.user.permissions as Permission[]
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
