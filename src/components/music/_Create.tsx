import { Form, Input, useFormContext } from "../Form";
import { createIdForm } from "./schema";
import { actions } from "astro:actions";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

function FormContent() {
    const formCtx = useFormContext();
    return (
        <>
            <label for="id">roblox id</label>
            <Input id="id" {...createIdForm.inputProps.id} />

            <label for="name">name</label>
            <Input id="name" {...createIdForm.inputProps.name} />

            <Button
                disabled={formCtx.value().submitStatus !== "idle"}
                type="submit"
            >
                {formCtx.value().submitStatus !== "idle"
                    ? "creating"
                    : "create"}
            </Button>
        </>
    );
}

export function CreateForm() {
    return (
        <>
            <Card class="w-full max-w-xs">
                <CardHeader>create a music id</CardHeader>
                <CardContent>
                    <Form
                        action={actions.music.createMusicId}
                        validator={createIdForm.validator}
                    >
                        <FormContent />
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
