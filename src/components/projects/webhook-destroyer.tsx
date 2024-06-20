import {
  FormError,
  createForm,
  zodForm,
  type SubmitHandler,
} from "@modular-forms/solid";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "@/components/ui/textfield";
import { toast } from "solid-sonner";

const formSchema = z.object({
  url: z
    .string()
    .url("you need to provide a valid URL.")
    .regex(
      /^(https:\/\/(?:discord\.com|ptb\.discord\.com|canary\.discord\.com)\/api\/webhooks\/)(?:.*)$/, // last time im ever writing a regex, this was hell
      "please enter a discord webhook url"
    ),
});

type FormSchema = z.infer<typeof formSchema>;

export function WebhookDestroyer() {
  const [destroyerForm, { Form, Field }] = createForm<FormSchema>({
    validate: zodForm(formSchema),
  });

  const handleSubmit: SubmitHandler<FormSchema> = async (values, event) => {
    try {
      const res = await fetch(values.url, {
        method: "DELETE",
      });

      if (res.status === 204) {
        toast.success("success", {
          description: "that webhook is now deleted",
        });
        values.url = "";
        return;
      }

      toast.error("error", {
        description: "that webhook doesn't exist",
      });

      throw new FormError<FormSchema>({
        url: "that webhook doesn't exist",
      });
    } catch (err) {
      throw new FormError<FormSchema>({
        url: "that webhook doesn't exist",
      });
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Field name="url">
        {(field, props) => (
          <TextFieldRoot
            class="w-full max-w-xs"
            validationState={field.error ? "invalid" : "valid"}
          >
            <TextFieldLabel>url to destroy</TextFieldLabel>
            <TextField {...props} type="url" required />
            {field.error && (
              <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
            )}
          </TextFieldRoot>
        )}
      </Field>
      <Button
        type="submit"
        variant={"destructive"}
        disabled={destroyerForm.submitting}
      >
        destroy
      </Button>
    </Form>
  );
}
