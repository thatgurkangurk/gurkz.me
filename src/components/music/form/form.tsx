import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "./hooks";
import { formOpts } from "./options";
import { orpc } from "@/lib/orpc";
import { FieldInfo } from "@/components/form/field-info";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const createMusicIdMutation = useMutation(
    orpc.music.create.mutationOptions()
  );
  const queryClient = useQueryClient();
  const form = useAppForm({
    ...formOpts,
    onSubmit: async ({ formApi, value }) => {
      await createMusicIdMutation.mutateAsync(value);

      await queryClient.refetchQueries({
        queryKey: orpc.music.get.queryKey(),
      });

      formApi.reset();
    },
  });
  return (
    <FormWrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        method="post"
        encType={"multipart/form-data"}
      >
        <form.AppForm>
          <form.AppField
            name="name"
            children={(field) => (
              <>
                <field.TextField label="name" />
                <FieldInfo field={field} />
              </>
            )}
          />
          <form.AppField
            name="robloxId"
            children={(field) => (
              <>
                <field.TextField label="roblox id" />
                <FieldInfo field={field} />
              </>
            )}
          />
          <form.Field name="tags" mode="array">
            {(field) => {
              return (
                <div>
                  {field.state.value.map((_, i) => {
                    return (
                      <form.AppField
                        key={i}
                        name={`tags[${i}]`}
                        children={(subField) => (
                          <>
                            <div className="flex w-full max-w-sm items-center gap-2">
                              <subField.TextFieldWithButton
                                buttonProps={{
                                  className: "mt-8",
                                  type: "button",
                                  variant: "destructive",
                                  size: "icon",
                                  children: <Trash />,
                                  onClick: () => {
                                    field.removeValue(i);
                                  },
                                }}
                                label={`tag ${i + 1}`}
                              />
                            </div>

                            <FieldInfo field={subField} />
                          </>
                        )}
                      />
                    );
                  })}
                  <Button
                    disabled={field.state.value.length > 3}
                    onClick={() => field.pushValue("")}
                    type="button"
                    className="my-2"
                    variant={"secondary"}
                  >
                    {field.state.value.length > 3
                      ? "max tags reached"
                      : "add tag"}
                  </Button>
                </div>
              );
            }}
          </form.Field>

          <form.SubscribeButton label="submit" />
        </form.AppForm>
      </form>
    </FormWrapper>
  );
}
