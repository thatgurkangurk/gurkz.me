import { ToolLayout } from "@/components/tool-layout";
import { useAppForm } from "@/components/ui/tanstack-form";
import { toolSeo } from "@/lib/tools";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, deepEqual } from "@tanstack/react-router";
import { z } from "zod/v4";
import { char, createRegExp, exactly } from "magic-regexp";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@tanstack/react-form";
import { useMemo } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tools/webhook-destroyer")({
  component: RouteComponent,
  head: () => ({
    meta: [
      ...toolSeo({
        tool: "webhook-destroyer",
      }),
    ],
  }),
});

const formSchema = z.object({
  url: z
    .url("please provide a valid URL")
    .regex(
      createRegExp(
        exactly(
          "https://",
          exactly("discord.com").or("ptb.discord.com").or("canary.discord.com"),
          "/api/webhooks/"
        )
          .grouped()
          .at.lineStart(),
        char.times.any().at.lineEnd()
      ),
      "please provide a discord webhook URL"
    ),
});

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      url: "",
    } satisfies z.infer<typeof formSchema>,
    onSubmit: async ({ value, formApi }) => {
      const promise = mutateAsync(value.url);
      // you're probably not supposed to do this but.......
      toast.promise(promise, {
        loading: "deleting...",
        success: () => {
          formApi.reset();
          return "successfully deleted";
        },
        error: () => {
          formApi.state.fieldMeta.url.errors.push({
            message: "that webhook does not exist",
          });
          return "something went wrong";
        },
      });
    },
    validators: {
      onChange: formSchema,
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["webhook-destroyer", "delete"],
    mutationFn: async (webhookUrl: string) => {
      const response = await fetch(webhookUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw {
          status: response.status,
          message: response.statusText || "Request failed",
        };
      }

      return {
        status: response.status,
        message: response.statusText || "OK",
      };
    },
  });
  const values = useStore(form.store, (state) => state.values);

  const hasChanges = useMemo(() => {
    return !deepEqual(values, form.options.defaultValues);
  }, [values]);

  return (
    <ToolLayout tool={"webhook-destroyer"}>
      {(tool) => (
        <>
          <h1 className="text-3xl">{tool.title}</h1>
          <h2 className="text-xl">{tool.description}</h2>

          <div className="flex items-center gap-2">
            <form.AppForm>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                method="post"
                encType={"multipart/form-data"}
              >
                <div className="space-y-4 pb-2">
                  <form.AppField
                    name="url"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>webhook url</field.FormLabel>
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
                        variant={"destructive"}
                      >
                        {isPending && <LoaderCircle className="animate-spin" />}{" "}
                        delete
                      </Button>
                    </>
                  )}
                </form.Subscribe>
              </form>
            </form.AppForm>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
