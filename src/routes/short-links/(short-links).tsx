import { protected$ } from "@solid-mediakit/auth";
import { RouteDefinition } from "@solidjs/router";
import { createForm } from "@tanstack/solid-form";
import { createSignal, Show } from "solid-js";
import { Field } from "~/components/form/field";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { createShortLink, shortLinkSchemas } from "~/server/actions/short-link";
import { canCreateShortLinks } from "~/server/short-links";

export const route = {
    preload: () => canCreateShortLinks(),
} satisfies RouteDefinition;

export default protected$(() => {
    const [submitErrors, setSubmitErrors] = createSignal<string[]>([]);
    const form = createForm(() => ({
        defaultValues: {
            slug: "",
            redirectTo: "",
        },
        onSubmit: ({ value }) => {
            shortenLink.mutate({
                redirectTo: value.redirectTo,
                slug: value.slug,
            });
        },
    }));
    const shortenLink = createShortLink(() => ({
        onError(err) {
            form.state.isFieldsValid = false;
            setSubmitErrors((errors) => [err.message, ...errors]);
        },
    }));

    return (
        <>
            <h1 class="text-3xl">link shortener</h1>
            <p class="italic">
                the spiritual successor to <a>https://l.gurkz.me/</a>{" "}
                <span>(it is down at the moment)</span>
            </p>

            <Card class="w-fit">
                <CardHeader>
                    <CardTitle>create a new short link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <Show when={submitErrors()}>
                            {(errors) => <p>{errors().join(",")}</p>}
                        </Show>
                        <form.Field
                            name="slug"
                            validators={{
                                onChange: shortLinkSchemas.slug,
                            }}
                            children={(field) => {
                                return <Field label="slug" field={field()} />;
                            }}
                        />
                        <form.Field
                            name="redirectTo"
                            validators={{
                                onChange: shortLinkSchemas.redirect,
                            }}
                            children={(field) => {
                                return (
                                    <Field
                                        label="redirect to"
                                        field={field()}
                                    />
                                );
                            }}
                        />

                        <Button type="submit">submit</Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
});
