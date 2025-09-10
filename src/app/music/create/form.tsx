"use client";

import { orpc } from "@/lib/orpc";
import { hasPermission } from "@/lib/permissions";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppForm } from "@/components/ui/tanstack-form";
import { defaultValues, schema } from "./schema";
import { useMemo } from "react";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-store";
import { deepEqual } from "@/lib/deep-equal";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";

function Form() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation(
    orpc.music.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.refetchQueries(orpc.music.get.queryOptions());
      },
    })
  );
  const form = useAppForm({
    defaultValues: defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value, formApi }) => {
      const promise = mutateAsync(value);
      // you're probably not supposed to do this but.......
      toast.promise(promise, {
        loading: "creating...",
        success: () => {
          formApi.reset();
          return "successfully created";
        },
        error: "something went wrong",
      });
    },
  });

  const formValues = useStore(form.store, (state) => state.values);
  const hasChanges = useMemo(() => {
    return !deepEqual(formValues, form.options.defaultValues);
  }, [formValues, form.options.defaultValues]);

  return (
    <div className="flex items-center gap-2">
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4">
            <form.AppField name="name">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>display name</field.FormLabel>
                  <field.FormControl>
                    <Input
                      aria-invalid={!field.state.meta.isValid}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>
            <form.AppField name="robloxId">
              {(field) => (
                <field.FormItem>
                  <field.FormLabel>roblox id</field.FormLabel>
                  <field.FormControl>
                    <Input
                      aria-invalid={!field.state.meta.isValid}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            </form.AppField>
            <form.AppField name="tags" mode="array">
              {(field) => {
                return (
                  <div>
                    {field.state.value?.map((_, i) => {
                      return (
                        <form.AppField key={i} name={`tags[${i}]`}>
                          {(subField) => (
                            <div className="flex w-full max-w-sm items-center gap-2">
                              <subField.FormItem>
                                <subField.FormLabel>
                                  tag {i + 1}
                                </subField.FormLabel>
                                <div className="flex w-full max-w-sm items-center gap-2">
                                  <subField.FormControl className="flex-1">
                                    <Input
                                      aria-invalid={
                                        !subField.state.meta.isValid
                                      }
                                      name={subField.name}
                                      value={subField.state.value}
                                      onChange={(e) =>
                                        subField.handleChange(e.target.value)
                                      }
                                      onBlur={subField.handleBlur}
                                    />
                                  </subField.FormControl>

                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => field.removeValue(i)}
                                  >
                                    <Trash />
                                  </Button>
                                </div>
                                <subField.FormMessage />
                              </subField.FormItem>
                            </div>
                          )}
                        </form.AppField>
                      );
                    })}
                    <Button
                      disabled={(field.state.value?.length ?? 0) > 3}
                      onClick={() => field.pushValue("")}
                      type="button"
                      className="my-2"
                      variant={"secondary"}
                    >
                      {(field.state.value?.length ?? 0) > 3
                        ? "max tags reached"
                        : "add tag"}
                    </Button>
                  </div>
                );
              }}
            </form.AppField>
          </div>
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <>
                <Button
                  disabled={
                    isPending || !hasChanges || !canSubmit || isSubmitting
                  }
                  type="submit"
                  variant={"default"}
                >
                  {isPending && <LoaderCircle className="animate-spin" />}{" "}
                  create
                </Button>
              </>
            )}
          </form.Subscribe>
        </form>
      </form.AppForm>
    </div>
  );
}

export function CreateMusicIdForm() {
  const { data } = useSuspenseQuery(orpc.session.get.queryOptions());
  return (
    <>
      {data && data?.user && hasPermission(data.user, "DEFAULT") ? (
        <Card className="w-full max-w-xs">
          <CardHeader>
            <CardTitle>create a music id</CardTitle>
          </CardHeader>
          <CardContent>
            <Form />
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
