import { Form, Input } from "../form";
import { Button } from "../ui/button";
import { useAuth } from "@solid-mediakit/auth/client";
import { LoaderCircle } from "lucide-solid";
import { Show, Suspense } from "solid-js";
import { toast } from "solid-sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useFormState } from "~/lib/form";
import { createIdForm, createMusicIdAction } from "~/lib/music";
import { getMusicIds } from "~/server/music";

export function CreateMusicIdForm() {
    const auth = useAuth();
    let buttonRef: HTMLButtonElement;
    const submission = useFormState(createMusicIdAction);
    const musicIdQueryUtils = getMusicIds.useUtils();

    return (
        <Suspense>
            <Show
                when={
                    auth.status() === "authenticated" &&
                    auth.session()?.user &&
                    auth
                        .session()
                        ?.user?.permissions.includes("CREATE_MUSIC_IDS")
                }
            >
                <Card class="w-full max-w-xs">
                    <CardHeader>
                        <CardTitle>create a music id</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            onSuccess={() => {
                                toast.success("created");
                                musicIdQueryUtils.invalidate();
                            }}
                            class="flex flex-col gap-2 items-start"
                            fieldErrors={submission.result?.fieldErrors}
                            validator={createIdForm.validator}
                            action={createMusicIdAction}
                        >
                            <Input {...createIdForm.inputProps.id} />
                            <Input {...createIdForm.inputProps.name} />
                            <Button
                                ref={buttonRef!}
                                disabled={submission.pending}
                                type="submit"
                            >
                                <Show
                                    when={submission.pending}
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
