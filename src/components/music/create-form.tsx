import { TextInput } from "../form/text-input";
import { Button } from "../ui/button";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import { LoaderCircle } from "lucide-solid";
import { Show, Suspense } from "solid-js";
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
    const [musicForm, { Form, Field }] = createForm<CreateMusicIdForm>({
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
                        </Form>
                    </CardContent>
                </Card>
            </Show>
        </Suspense>
    );
}
