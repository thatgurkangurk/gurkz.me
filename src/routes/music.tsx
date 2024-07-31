import { createSignal, For, Match, Switch } from "solid-js";
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
	TextFieldRoot,
} from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";
import { toast } from "solid-sonner";

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

export default function MusicIdList() {
	const infinite = trpc.music.getInfiniteMusicIds.createInfiniteQuery(
		() => ({
			limit: 15,
		}),
		() => ({
			initialPageParam: undefined, //? shockingly, that works
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}),
	);
	const user = createAsync(() => getAuthenticatedUser());

	return (
		<>
			<h2 class="text-2xl">music id list</h2>
			<Show when={user()?.permissions.includes("CREATE_MUSIC_IDS")}>
				<CreateMusicCard />
			</Show>

			<Show
				when={!infinite.isPending}
				fallback={
					<>
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
						<MusicCardSkeleton />
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
				<>
					<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
						<For
							each={infinite.data?.pages}
							fallback={<p>no music ids have been created yet.</p>}
						>
							{(page) => (
								<For each={page.data}>
									{(musicId) => <MusicCard musicId={musicId} />}
								</For>
							)}
						</For>
					</div>
				</>
			</Show>

			<div class="pt-2">
				<Switch fallback={<p>nothing more to load</p>}>
					<Match when={infinite.hasNextPage}>
						<Button onClick={() => infinite.fetchNextPage()}>fetch more</Button>
					</Match>
					<Match when={infinite.isFetching}>
						<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
							<MusicCardSkeleton />
						</div>
					</Match>
				</Switch>
			</div>
		</>
	);
}
