import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "../ui/textfield";
import {
  createForm,
  reset,
  zodForm,
  type SubmitHandler,
} from "@modular-forms/solid";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import { navigate } from "astro:transitions/client";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const CreateIdSchema = z.object({
  robloxId: z
    .string()
    .min(4, {
      message: "id has to be longer than 4 characters",
    })
    .max(24, {
      message: "id has to be shorter than 24 characters",
    }),
  name: z
    .string()
    .min(8, {
      message: "name has to be longer than 4 characters",
    })
    .max(128, {
      message: "name has to be shorter than 48 characters",
    })
    .refine(
      (input) => {
        if (matcher.hasMatch(input)) return false;
        return true;
      },
      {
        message: "name cannot include profanity",
      }
    ),
});

type CreateIdForm = z.infer<typeof CreateIdSchema>;

export function CreateCard() {
  const [form, { Form, Field }] = createForm<CreateIdForm>({
    validate: zodForm(CreateIdSchema),
  });

  const handleSubmit: SubmitHandler<CreateIdForm> = async (_, event) => {
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await fetch("/api/music-id/create", {
      method: "POST",
      body: formData,
    });

    console.log("created");

    const data = await response.json();

    console.log(data);

    console.log(response);

    if (response.ok) {
      console.log("response was ok");
      reset(form);
      navigate("/music");
    }
  };

  return (
    <Card class="w-full max-w-xs">
      <CardHeader>
        <CardTitle>add a music id</CardTitle>
      </CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit}>
          <Field name="robloxId">
            {(field, props) => (
              <TextFieldRoot
                class="w-full max-w-xs"
                validationState={field.error ? "invalid" : "valid"}
              >
                <TextFieldLabel>roblox id</TextFieldLabel>
                <TextField {...props} required />
                {field.error && (
                  <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
                )}
              </TextFieldRoot>
            )}
          </Field>

          <Field name="name">
            {(field, props) => (
              <TextFieldRoot
                class="w-full max-w-xs"
                validationState={field.error ? "invalid" : "valid"}
              >
                <TextFieldLabel>name</TextFieldLabel>
                <TextField {...props} required />
                {field.error && (
                  <TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
                )}
              </TextFieldRoot>
            )}
          </Field>
          <Button type="submit">create</Button>
        </Form>
      </CardContent>
    </Card>
  );
}
