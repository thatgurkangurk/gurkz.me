import {
	createForm,
	zodForm,
	reset,
	type SubmitHandler,
} from "@modular-forms/solid";
import { toast } from "solid-sonner";
import type { z } from "zod";
import { createIdSchema } from "~/lib/music";
import { trpc, queryClient } from "~/lib/trpc/client";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
	TextField,
	TextFieldRoot,
	TextFieldLabel,
	TextFieldErrorMessage,
} from "../ui/textfield";
import { Button } from "../ui/button";
import { revalidate } from "@solidjs/router";

type CreateIdForm = z.infer<typeof createIdSchema>;

export function CreateMusicCard() {
	const [form, { Form, Field }] = createForm<CreateIdForm>({
		validate: zodForm(createIdSchema),
	});
	const mutation = trpc.music.createMusicId.createMutation(() => ({
		onError: () => {
			toast.error("error", {
				description: "something went wrong while creating the id",
			});
		},
		onSuccess: () => {
			toast.success("success", {
				description: "successfully created the music id",
			});
			queryClient.refetchQueries({
				queryKey: [["music"]],
			});
			revalidate("music_ids");
			reset(form);
		},
	}));

	const handleSubmit: SubmitHandler<CreateIdForm> = async (input, event) => {
		await mutation.mutate({
			id: input.id,
			name: input.name,
		});
		reset(form, ["id", "name"]);
	};

	return (
		<Card class="w-full max-w-xs">
			<CardHeader>
				<CardTitle>add a music id</CardTitle>
			</CardHeader>
			<CardContent>
				<Form onSubmit={handleSubmit}>
					<Field name="id">
						{(field, props) => (
							<TextFieldRoot
								class="w-full max-w-xs"
								validationState={field.error ? "invalid" : "valid"}
							>
								<TextFieldLabel>roblox id</TextFieldLabel>
								<TextField {...props} type="number" required />
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
								<TextField {...props} type="text" required />
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
