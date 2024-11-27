import { useAuth } from "@solid-mediakit/auth/client";
import { For, Show } from "solid-js";
import { Card, CardContent, CardHeader } from "~/lib/components/ui/card";
import {
  createMusicId,
  createMusicIdSchema,
  type CreateMusicIdSchema,
  getMusicIds,
  MusicId,
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
import { MusicCard } from "~/lib/components/music/music-card";

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
        const newData: MusicId = {
          ...newId,
          createdById: currentUser.id,
          robloxId: parseInt(newId.id),
          created: new Date(),
          working: true,
          creator: {
            name: `${currentUser.name}`,
            image: `${currentUser.image}`,
            ...currentUser,
          },
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
      <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
        <For
          each={musicIds.data}
          fallback={<p>no music ids have been created</p>}
        >
          {(musicId) => <MusicCard musicId={musicId} />}
        </For>
      </div>
    </>
  );
}
