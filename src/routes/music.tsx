import { createSignal, For } from "solid-js";
import { Show } from "solid-js";
import { queryClient, trpc } from "~/lib/trpc/client";
import type { InferSelectModel } from "drizzle-orm";
import type { User } from "lucia";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { musicIds } from "~/lib/schema/music";
import { Skeleton } from "~/components/ui/skeleton";
import { LoaderCircle } from "lucide-solid";
import { createAsync } from "@solidjs/router";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import type { z } from "zod";
import { createIdSchema } from "~/lib/music";
import {
	createForm,
	reset,
	type SubmitHandler,
	zodForm,
} from "@modular-forms/solid";
import {
	TextField,
	TextFieldLabel,
	TextFieldErrorMessage,
	TextFieldInput,
} from "~/components/ui/text-field";
import { Button } from "~/components/ui/button";
import { showToast } from "~/components/ui/toast";

type MusicId = InferSelectModel<typeof musicIds> & {
	creator: User;
};

function MusicCard(props: { musicId: MusicId }) {
	return (
		<Card class="w-full h-full">
			<CardHeader>
				<CardTitle class="text-xl">{props.musicId.name}</CardTitle>
			</CardHeader>
			<CardContent class="flex items-center text-xl">
				<span>{props.musicId.robloxId}</span>
			</CardContent>
			<CardFooter class="grid grid-cols-1">
				<span>created by: {props.musicId.creator.username}</span>
			</CardFooter>
		</Card>
	);
}

function MusicCardSkeleton() {
	return (
		<Card class="w-full h-full">
			<CardHeader>
				<CardTitle class="text-xl pt-1">
					<Skeleton class="h-6 w-2 sm:w-48 md:w-48 lg:w-60" />
				</CardTitle>
			</CardHeader>
			<CardContent class="flex items-center text-xl gap-2 pt-3">
				<Skeleton class="h-6 w-2 sm:w-32 md:w-32 lg:w-48" />
				<Skeleton class="h-6 w-6" />
			</CardContent>
			<CardFooter class="grid grid-cols-1 gap-1">
				<Skeleton class="h-10" />
				<Skeleton class="h-6 w-[95%]" />
			</CardFooter>
			<div class="p-2">
				<LoaderCircle class="h-6 w-6 animate-spin" />
			</div>
		</Card>
	);
}

type CreateIdForm = z.infer<typeof createIdSchema>;

function CreateMusicCard() {
	const [form, { Form, Field }] = createForm<CreateIdForm>({
		validate: zodForm(createIdSchema),
	});
	const mutation = trpc.music.createMusicId.createMutation(() => ({
		onError: () => {
			showToast({
				title: "error",
				description: "something went wrong while creating the id",
				variant: "error",
			});
		},
		onSuccess: () => {
			showToast({
				title: "success",
				description: "successfully created the music id",
				variant: "success",
			});
			queryClient.refetchQueries({
				queryKey: [["music"]],
			});
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
							<TextField
								class="w-full max-w-xs"
								validationState={field.error ? "invalid" : "valid"}
							>
								<TextFieldLabel>roblox id</TextFieldLabel>
								<TextFieldInput {...props} type="number" required />
								{field.error && (
									<TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
								)}
							</TextField>
						)}
					</Field>

					<Field name="name">
						{(field, props) => (
							<TextField
								class="w-full max-w-xs"
								validationState={field.error ? "invalid" : "valid"}
							>
								<TextFieldLabel>name</TextFieldLabel>
								<TextFieldInput {...props} type="text" required />
								{field.error && (
									<TextFieldErrorMessage>{field.error}</TextFieldErrorMessage>
								)}
							</TextField>
						)}
					</Field>
					<Button type="submit">create</Button>
				</Form>
			</CardContent>
		</Card>
	);
}

export default function MusicIdList() {
	const query = trpc.music.getMusicIds.createQuery();
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<>
			<h2 class="text-2xl">music id list</h2>
			<Show when={user()?.permissions.includes("CREATE_MUSIC_IDS")}>
				<CreateMusicCard />
			</Show>
			<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
				<Show
					when={!query.isFetching}
					fallback={
						<>
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
						</>
					}
				>
					{/* biome-ignore lint/style/noNonNullAssertion: i know it is safe since it isn't fetching */}
					<For each={query.data!.data} fallback={<p>there isn't any data</p>}>
						{(id) => (
							<>
								<MusicCard musicId={id} />
							</>
						)}
					</For>
				</Show>
			</div>
		</>
	);
}
