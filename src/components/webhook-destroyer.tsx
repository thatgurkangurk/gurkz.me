import { Input as ValibotInput, object, regex, string, url } from "valibot";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  FormError,
  SubmitHandler,
  createForm,
  reset,
  setResponse,
  valiForm,
} from "@modular-forms/solid";
import { Grid } from "./ui/grid";
import { Button } from "./ui/button";
import { TbLoader } from "solid-icons/tb";
import { showToast } from "./ui/toast";
import { trackEvent } from "~/lib/umami";

const FormSchema = object({
  url: string([
    url("you need to put in a valid URL."),
    regex(
      /^(https:\/\/(?:discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/)(?:.*)$/,
      "that URL does not look like a discord webhook url..."
    ),
  ]),
});
export type WebhookForm = ValibotInput<typeof FormSchema>;

const WebhookDestroyer = () => {
  const [webhookForm, { Form, Field }] = createForm<WebhookForm>({
    validate: valiForm(FormSchema),
  });

  const handleSubmit: SubmitHandler<WebhookForm> = (values) => {
    return fetch(values.url, {
      method: "DELETE",
    })
      .catch(() => {
        throw new FormError<WebhookForm>(
          "something went wrong when trying to delete."
        );
      })
      .then((res) => {
        reset(webhookForm);
        if (res.status === 204) {
          setResponse(webhookForm, {
            status: "success",
            message: "webhook has been deleted",
          });
          showToast({
            title: "success",
            description: "webhook has been deleted",
            duration: 5000,
          });
          trackEvent("deleted webhook");
        } else {
          setResponse(webhookForm, {
            status: "error",
            message: "that webhook does not exist",
          });
          showToast({
            title: "error",
            description: "that webhook does not exist",
            variant: "destructive",
            duration: 5000,
          });
        }
      });
  };

  return (
    <div class="grid gap-6">
      <Form onSubmit={handleSubmit}>
        <Grid class="gap-4">
          <Field name="url">
            {(field, props) => (
              <Grid class="gap-1">
                <Label class="sr-only" for="url">
                  webhook url
                </Label>
                {field.error && (
                  <Label for="url" class="text-red-500">
                    {field.error}
                  </Label>
                )}
                <Input
                  type="url"
                  required
                  id="url"
                  placeholder="https://discord.com/api/webhooks..."
                  class={`${
                    field.error
                      ? " focus-visible:ring-red-500 focus-visible:ring-2 focus:border-none border-red-500"
                      : ""
                  }`}
                  {...props}
                />
              </Grid>
            )}
          </Field>
          <Button
            type="submit"
            class="w-fit p-4"
            variant="default"
            disabled={webhookForm.submitting}
          >
            {webhookForm.submitting && (
              <TbLoader class="mr-2 h-4 w-4 animate-spin" />
            )}
            destroy
          </Button>
        </Grid>
      </Form>
    </div>
  );
};

export { WebhookDestroyer };
