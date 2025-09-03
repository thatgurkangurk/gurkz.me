import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "@/components/ui/tanstack-form";
import { formOpts } from "./options";
import { orpc } from "@/lib/orpc";
import { LoaderCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useStore } from "@tanstack/react-form";
import { deepEqual } from "@tanstack/react-router";

function FormWrapper({ children }: { children: ReactNode }) {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>create a music id</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function CreateMusicIdForm() {
  const { mutateAsync, isPending } = useMutation(
    orpc.music.create.mutationOptions()
  );
  const queryClient = useQueryClient();
  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ formApi, value }) => {
      await mutateAsync(value);

      await queryClient.refetchQueries({
        queryKey: orpc.music.get.queryKey(),
      });

      formApi.reset();
    },
  });
  const handleSubmit = useCallback(() => {
    const promise = mutateAsync(form.state.values);
    toast.promise(promise, {
      loading: "creating...",
      success: `successfully created`,
      error: "something went wrong",
    });
  }, [form, mutateAsync]);

  const formValues = useStore(form.store, (state) => state.values);
  const hasChanges = useMemo(() => {
    return !deepEqual(formValues, form.options.defaultValues);
  }, [formValues]);

  return (
    <FormWrapper>
      <div className="flex items-center gap-2">
        <form.AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            method="post"
            encType={"multipart/form-data"}
          >
            <div className="space-y-4">
              <form.AppField
                name="name"
                children={(field) => (
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
              />
              <form.AppField
                name="robloxId"
                children={(field) => (
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
              />
              <form.AppField name="tags" mode="array">
                {(field) => {
                  return (
                    <div>
                      {field.state.value?.map((_, i) => {
                        return (
                          <form.AppField
                            key={i}
                            name={`tags[${i}]`}
                            children={(subField) => (
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
                          />
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
            <form.Subscribe selector={(state) => state.isValid}>
              {(isValid) => (
                <Button
                  disabled={isPending || !hasChanges || !isValid}
                  onClick={handleSubmit}
                >
                  {isPending && <LoaderCircle className="animate-spin" />}{" "}
                  create
                </Button>
              )}
            </form.Subscribe>
          </form>
        </form.AppForm>
      </div>
    </FormWrapper>
  );
}
