import { useAuth } from "@solid-mediakit/auth/client";
import { For, Show } from "solid-js";
import { Card, CardContent, CardHeader } from "~/lib/components/ui/card";
import {
  createMusicId,
  createMusicIdSchema,
  type CreateMusicIdSchema,
  getMusicIds,
} from "~/lib/music";
import {
  createForm,
  reset,
  SubmitHandler,
  zodForm,
} from "@modular-forms/solid";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "~/lib/components/ui/text-field";
import { Button } from "~/lib/components/ui/button";

function CreateMusicIdForm() {
  const auth = useAuth();
  const musicIdUtils = getMusicIds.useUtils();
  const [musicForm, { Form, Field }] = createForm<CreateMusicIdSchema>({
    validate: zodForm(createMusicIdSchema),
  });
  const { mutate } = createMusicId(() => ({
    async onMutate(newId) {
      await musicIdUtils.cancel();

      const prevData = musicIdUtils.getData();

      musicIdUtils.setData(undefined, (old) => {
        const currentUser = auth.session()!.user;
        const newData: {
          id: string;
          name: string;
          robloxId: number;
          createdById: string;
          created: Date;
          working: boolean;
        } = {
          ...newId,
          createdById: currentUser.id,
          robloxId: parseInt(newId.id),
          created: new Date(),
          working: true,
        };

        if (old) return [...old, newData];

        return [newData];
      });

      return { prevData };
    },

    onError(err, newId, ctx) {
      musicIdUtils.setData(undefined, ctx!.prevData);
    },
    onSettled() {
      musicIdUtils.invalidate();
    },
  }));

  const handleSubmit: SubmitHandler<CreateMusicIdSchema> = (values, event) => {
    mutate({
      ...values,
    });

    reset(musicForm, ["id", "name"]);
  };

  return (
    <Card class="w-full max-w-xs">
      <CardHeader>create a music id</CardHeader>
      <CardContent>
        <Form onSubmit={handleSubmit}>
          <Field name="id">
            {(field, props) => (
              <>
                <TextField
                  class="w-full max-w-xs"
                  validationState={field.error ? "invalid" : "valid"}
                >
                  <TextFieldLabel>roblox id</TextFieldLabel>
                  <TextFieldInput
                    value={field.value || ""}
                    type="text"
                    {...props}
                    required
                  />

                  {field.error && (
                    <TextFieldErrorMessage class="py-2">
                      {field.error}
                    </TextFieldErrorMessage>
                  )}
                </TextField>
              </>
            )}
          </Field>
          <Field name="name">
            {(field, props) => (
              <>
                <TextField
                  class="w-full max-w-xs"
                  validationState={field.error ? "invalid" : "valid"}
                >
                  <TextFieldLabel>name</TextFieldLabel>
                  <TextFieldInput
                    type="text"
                    {...props}
                    required
                    value={field.value || ""}
                  />
                  {field.error && (
                    <TextFieldErrorMessage class="py-2">
                      {field.error}
                    </TextFieldErrorMessage>
                  )}
                </TextField>
              </>
            )}
          </Field>
          <Button class="mt-2" type="submit">
            create
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function Music() {
  const auth = useAuth();
  const musicIds = getMusicIds();

  return (
    <>
      <h1 class="text-3xl">music id list</h1>

      <Show
        when={
          auth.session() &&
          auth.session()?.user.permissions.includes("CREATE_MUSIC_IDS")
        }
      >
        <CreateMusicIdForm />
      </Show>

      <For
        each={musicIds.data}
        fallback={<p>no music ids have been created</p>}
      >
        {(musicId) => (
          <p>
            {musicId.name}: {musicId.robloxId}
          </p>
        )}
      </For>
    </>
  );
}
