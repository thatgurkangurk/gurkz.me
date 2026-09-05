<script lang="ts">
	import { CreateNewClipArgs } from "#lib/schemas/clip.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { NativeSelect, NativeSelectOption } from "#lib/components/ui/native-select/index.js";
	import { createNewClip } from "#lib/api/ttcore/clips.remote.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { useSession } from "#lib/session.svelte.js";
	import { getUsers } from "#lib/api/admin.remote.js";
	import { ButtonGroup } from "#lib/components/ui/button-group/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import InputErrors from "#lib/components/form/input-errors.svelte";
	import { toErrors } from "#lib/utils/to-errors.js";
	import Textarea from "#lib/components/ui/textarea/textarea.svelte";
	import { autoAnimate } from "#lib/attachments/auto-animate.svelte.js";
	import { configureForm } from "#lib/remote-form.svelte.js";
	import { toast } from "svelte-sonner";
	import { getProfiles } from "#lib/api/ttcore/profiles.remote.js";

	type Props = {
		videoId: string;
	};

	let { videoId }: Props = $props();

	let formEl: HTMLFormElement | undefined = $state.raw();

	const configured = configureForm(() => ({
		form: createNewClip,
		formEl,
		schema: CreateNewClipArgs,
		initialErrors: false,
		navBlockMessage: "you have unsaved changes. are you sure?",
		onresult: ({ success, error }) => {
			if (success) {
				toast.success("successfully submitted");
			} else if (error) {
				toast.error(error);
			}
		}
	}));

	const session = useSession();

	const adminDataPromise = $derived.by(async () => {
		if (session.current?.user.admin) {
			return Promise.all([getProfiles(), getUsers()]);
		}
		return [[], []];
	});

	const adminData = $derived(await adminDataPromise);

	const profiles = $derived(adminData[0]);
	const users = $derived(adminData[1]);

	const profileValues = $derived.by(() => {
		return profiles.map((profile) => ({
			value: profile.id,
			label: `${profile.line1} - ${profile.line2}`
		}));
	});

	const userValues = $derived.by(() => {
		return users.map((user) => ({
			value: user.id,
			label: `${user.name} - @${user.username}`
		}));
	});

	let songs = $state<string[]>([]);
	createNewClip.fields.songs.set(songs);

	function addSong() {
		if (songs.length >= 12) return;
		songs.push("");
	}

	function removeSong(indexToRemove: number) {
		songs.splice(indexToRemove, 1);
	}

	function removeAllSongs() {
		songs.length = 0;
	}

	const { form, attributes, submitting } = $derived(configured());
</script>

<div class="space-y-6">
	<div class="space-y-1.5 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm shadow-sm">
		<p class="text-muted-foreground">
			if you do not have a direct video link, go here to upload one:
			<a
				class="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
				href="https://www.image2url.com/video-to-url"
				target="_blank"
				rel="noreferrer"
			>
				image2url.com/video-to-url
			</a>
		</p>
		<p class="font-medium text-amber-500">
			please do not use discord cdn links, since they expire !
		</p>
	</div>

	<form bind:this={formEl} {...attributes} enctype="multipart/form-data" class="space-y-6 text-sm">
		<input {...form.fields.videoId.as("hidden", videoId)} />

		<div class="space-y-5 rounded-xl border bg-card p-6 shadow-sm">
			<h2 class="text-sm font-semibold tracking-wide text-foreground">video details</h2>

			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<div class="space-y-2">
					<Label class={["text-xs font-medium", !!form.fields.title.issues() && "text-destructive"]}
						>title</Label
					>
					<Input
						{...form.fields.title.as("text")}
						aria-errormessage="{form.fields.title.as('text').name}-error"
						aria-invalid={!!form.fields.title.issues()}
						placeholder="my amazing clip"
						class="h-10"
					/>
					<InputErrors
						name={form.fields.title.as("text").name}
						errors={toErrors(form.fields.title.issues()?.map((value) => value.message) ?? [])}
					/>
				</div>

				<div class="space-y-2">
					<Label class={["text-xs font-medium", !!form.fields.url.issues() && "text-destructive"]}
						>direct link to a video</Label
					>
					<Input
						{...form.fields.url.as("url")}
						aria-errormessage="{form.fields.url.as('url').name}-error"
						aria-invalid={!!form.fields.url.issues()}
						placeholder="https://my.clip.host/clip.mp4"
						class="h-10"
					/>
					<InputErrors
						name={form.fields.url.as("url").name}
						errors={toErrors(form.fields.url.issues()?.map((value) => value.message) ?? [])}
					/>
				</div>
			</div>

			<div class="space-y-2">
				<Label class={["text-xs font-medium", !!form.fields.note.issues() && "text-destructive"]}
					>note (optional)</Label
				>
				<Textarea
					{...form.fields.note.as("text")}
					aria-errormessage="{form.fields.note.as('text').name}-error"
					aria-invalid={!!form.fields.note.issues()}
					rows={3}
					class="min-h-22.5 resize-y"
				/>
				<InputErrors
					name={form.fields.note.as("text").name}
					errors={toErrors(form.fields.note.issues()?.map((value) => value.message) ?? [])}
				/>
			</div>
		</div>

		<div class="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-sm font-semibold tracking-wide text-foreground">songs used</h2>
					<p class="mt-0.5 text-xs text-muted-foreground">in correct order, please!</p>
				</div>
				{#if songs.length > 0}
					<button
						type="button"
						onclick={removeAllSongs}
						class="text-xs font-medium text-destructive hover:underline"
					>
						remove all songs
					</button>
				{/if}
			</div>

			<div class="space-y-3" {@attach autoAnimate({ duration: 150 })}>
				{#each songs, idx (idx)}
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<Input
								{...form.fields.songs[idx].as("text")}
								aria-errormessage="{form.fields.songs[idx].as('text').name}-error"
								aria-invalid={!!form.fields.songs[idx].issues()}
								placeholder={`song ${idx + 1}`}
								class="h-10"
							/>
							<Button
								variant="outline"
								type="button"
								size="icon"
								class="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
								disabled={!!form.pending}
								onclick={() => removeSong(idx)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
						<InputErrors
							name={form.fields.songs[idx].as("text").name}
							errors={toErrors(
								form.fields.songs[idx].issues()?.map((value) => value.message) ?? []
							)}
						/>
					</div>
				{/each}
			</div>

			<Button
				type="button"
				variant="outline"
				disabled={songs.length >= 12}
				onclick={addSong}
				class="h-10 w-full border-dashed text-xs font-medium"
			>
				+ add song
			</Button>
		</div>

		{#if session.current?.user.admin}
			<div class="space-y-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6">
				<div class="flex items-center gap-2">
					<span
						class="rounded bg-amber-500/10 px-2 py-1 text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400"
					>
						admin options
					</span>
				</div>

				<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
					<div class="space-y-2">
						<Label class="text-xs font-medium">profile override</Label>
						<ButtonGroup class="w-full">
							<NativeSelect
								{...form.fields.profileOverride.as("select", "")}
								class="h-10 rounded-r-none border-r-0"
							>
								<NativeSelectOption value="">select a profile override</NativeSelectOption>
								{#each profileValues as profile (profile.value)}
									<NativeSelectOption value={profile.value}>{profile.label}</NativeSelectOption>
								{/each}
							</NativeSelect>

							<Button
								type="button"
								onclick={() => form.fields.profileOverride.set("")}
								variant="destructive"
								size="icon"
								disabled={form.fields.profileOverride.value() === ""}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</ButtonGroup>
						<InputErrors
							name={form.fields.profileOverride.as("select").name}
							errors={toErrors(
								form.fields.profileOverride.issues()?.map((value) => value.message) ?? []
							)}
						/>
					</div>

					<div class="space-y-2">
						<Label class="text-xs font-medium">user override</Label>
						<ButtonGroup class="w-full">
							<NativeSelect {...form.fields.userOverride.as("select", "")} class="h-10 border-r-0">
								<NativeSelectOption value="">select a user override</NativeSelectOption>
								{#each userValues as user (user.value)}
									<NativeSelectOption value={user.value}>{user.label}</NativeSelectOption>
								{/each}
							</NativeSelect>

							<Button
								type="button"
								onclick={() => form.fields.userOverride.set("")}
								variant="destructive"
								size="icon"
								disabled={form.fields.userOverride.value() === ""}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</ButtonGroup>
						<InputErrors
							name={form.fields.userOverride.as("select").name}
							errors={toErrors(
								form.fields.userOverride.issues()?.map((value) => value.message) ?? []
							)}
						/>
					</div>
				</div>
			</div>
		{/if}

		<div class="flex justify-end pt-2">
			<Button
				type="submit"
				disabled={submitting}
				class="h-11 w-full px-10 text-sm font-medium md:w-auto"
			>
				{submitting ? "submitting..." : "submit"}
			</Button>
		</div>
	</form>
</div>
