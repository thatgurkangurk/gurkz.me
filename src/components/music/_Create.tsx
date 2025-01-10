import { Form, Input, useFormContext } from "../Form";
import { createForm } from "simple:form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export const createIdForm = createForm({
    id: z
        .string()
        .min(4, {
            message: "id has to be longer than 4 characters",
        })
        .max(24, {
            message: "id has to be shorter than 24 characters",
        })
        .refine((arg) => parseInt(arg), {
            message: "you have to provide a number",
        }),
    name: z
        .string()
        .min(6, {
            message: "the name has to be longer than 6 characters",
        })
        .max(128, {
            message: "the name has to be shorter than 128 characters",
        }),
});

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
                    <Form action="/music" validator={createIdForm.validator}>
                        <FormContent />
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
