import { TextInput } from "../form/text-input";
import { Button } from "../ui/button";
import {
    createForm,
    insert,
    remove,
    SubmitHandler,
    zodForm,
} from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import { LoaderCircle, TrashIcon } from "lucide-solid";
import { createSignal, For, Show, Suspense } from "solid-js";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/lib/auth/actions";
import {
    createMusicId,
    CreateMusicIdForm,
    CreateMusicIdSchema,
    getMusicIds,
} from "~/server/music";

export function CreateMusicForm() {
    const user = createAsync(() => auth());
    const musicIdQueryUtils = getMusicIds.useUtils();
    const [tagsLength, setTagsLength] = createSignal<number>(0);
    const [musicForm, { Form, Field, FieldArray }] =
        createForm<CreateMusicIdForm>({
            validate: zodForm(CreateMusicIdSchema),
        });
    const musicIdMutation = createMusicId(() => ({
        onSuccess: () => {
            musicIdQueryUtils.invalidate();
        },
    }));

    const handleSubmit: SubmitHandler<CreateMusicIdForm> = async (values) => {
        await musicIdMutation.mutateAsync(values).catch((e) => console.log(e));
    };

    const hasReachedMaxTags = () => tagsLength() > 3;

    return (
        <Suspense>
            <Show when={user()}>
                <Card class="w-full max-w-xs">
                    <CardHeader>
                        <CardTitle>create a music id</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form onSubmit={handleSubmit}>
                            <Field name="id">
                                {(field, props) => (
                                    <TextInput
                                        {...props}
                                        type="text"
                                        label="roblox id"
                                        value={field.value}
                                        error={field.error}
                                    />
                                )}
                            </Field>
                            <Field name="name">
                                {(field, props) => (
                                    <TextInput
                                        {...props}
                                        type="text"
                                        label="name"
                                        value={field.value}
                                        error={field.error}
                                    />
                                )}
                            </Field>

                            <FieldArray name="tags">
                                {(fieldArray) => (
                                    <div class="py-2 grid grid-cols-2 gap-2">
                                        <For each={fieldArray.items}>
                                            {(_, index) => (
                                                <>
                                                    <Field
                                                        name={`tags.${index()}`}
                                                    >
                                                        {(field, props) => (
                                                            <>
                                                                <TextInput
                                                                    {...props}
                                                                    type="text"
                                                                    label={`tag ${index() + 1}`}
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    error={
                                                                        field.error
                                                                    }
                                                                />
                                                                <Button
                                                                    class="mt-4.5 w-fit"
                                                                    onClick={() => {
                                                                        remove(
                                                                            musicForm,
                                                                            "tags",
                                                                            {
                                                                                at: index(),
                                                                            }
                                                                        );
                                                                        setTagsLength(
                                                                            tagsLength() -
                                                                                1
                                                                        );
                                                                    }}
                                                                >
                                                                    <TrashIcon />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Field>
                                                </>
                                            )}
                                        </For>
                                    </div>
                                )}
                            </FieldArray>
                            <div class="flex gap-2">
                                <Button
                                    disabled={hasReachedMaxTags()}
                                    onClick={() => {
                                        insert(musicForm, "tags", {
                                            value: "",
                                        });
                                        setTagsLength(tagsLength() + 1);
                                    }}
                                >
                                    <Show
                                        when={hasReachedMaxTags()}
                                        fallback={<>add a tag</>}
                                    >
                                        maximum tags reached
                                    </Show>
                                </Button>
                                <Button
                                    disabled={musicForm.submitting}
                                    type="submit"
                                >
                                    <Show
                                        when={musicForm.submitting}
                                        fallback={<>submit</>}
                                    >
                                        <LoaderCircle class="animate-spin" />{" "}
                                        submitting
                                    </Show>
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </Show>
        </Suspense>
    );
}
