<script lang="ts">
	import { CreateNewClipArgs } from "$lib/schemas/clip.js";
	import { Button } from "$lib/components/ui/button";
	import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
	import { createNewClip } from "$lib/api/ttcore/clips.remote.js";
	import { Label } from "$lib/components/ui/label";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { useSession } from "$lib/session.svelte";
	import { getUsers } from "$lib/api/admin.remote.js";
	import { ButtonGroup } from "$lib/components/ui/button-group/index.js";
	import { Input } from "$lib/components/ui/input";
	import InputErrors from "$lib/components/form/input-errors.svelte";
	import { toErrors } from "$lib/utils/to-errors";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import { autoAnimate } from "$lib/attachments/auto-animate.svelte";
	import { configureForm } from "$lib/remote-form.svelte";
	import { toast } from "svelte-sonner";
	import { getProfiles } from "$lib/api/ttcore/profiles.remote";

	type Props = {
		videoId: string;
	};

	let { videoId }: Props = $props();

	let formEl: HTMLFormElement | undefined = $state.raw();

	const configured = configureForm(() => ({
		form: createNewClip,
		formEl,
		schema: CreateNewClipArgs,
		initialErrors: true,
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

<br />

<p>
	if you do not have a direct video link, go here to upload one: <a
		class="underline underline-offset-4"
		href="https://www.image2url.com/video-to-url">https://www.image2url.com/video-to-url</a
	>
</p>

<br />

<p>please do not use discord cdn links, since they expire !</p>

<br />

<form bind:this={formEl} {...attributes} enctype="multipart/form-data">
	<input {...form.fields.videoId.as("hidden", videoId)} />

	<div>
		<Label class={[!!form.fields.title.issues() && "text-destructive", "pb-2"]}>title</Label>
		<Input
			{...form.fields.title.as("text")}
			aria-errormessage="{form.fields.title.as('text').name}-error"
			aria-invalid={!!form.fields.title.issues()}
			placeholder="my amazing clip"
		/>

		<InputErrors
			name={form.fields.title.as("text").name}
			errors={toErrors(form.fields.title.issues()?.map((value) => value.message) ?? [])}
		/>
	</div>
	<br />
	<div>
		<Label class={[!!form.fields.url.issues() && "text-destructive", "pb-2"]}
			>direct link to a video</Label
		>
		<Input
			{...form.fields.url.as("url")}
			aria-errormessage="{form.fields.url.as('url').name}-error"
			aria-invalid={!!form.fields.url.issues()}
			placeholder="https://my.clip.host/clip.mp4"
		/>

		<InputErrors
			name={form.fields.url.as("url").name}
			errors={toErrors(form.fields.url.issues()?.map((value) => value.message) ?? [])}
		/>
	</div>
	<br />
	<div>
		<Label class={[!!form.fields.note.issues() && "text-destructive", "pb-2"]}
			>note (optional)</Label
		>
		<Textarea
			{...form.fields.note.as("text")}
			aria-errormessage="{form.fields.note.as('text').name}-error"
			aria-invalid={!!form.fields.note.issues()}
		/>

		<InputErrors
			name={form.fields.note.as("text").name}
			errors={toErrors(form.fields.note.issues()?.map((value) => value.message) ?? [])}
		/>
	</div>

	<br />
	<br />

	<Label class="pb-2">songs used (in correct order, please!)</Label>

	<div {@attach autoAnimate({ duration: 150 })}>
		{#each songs, idx (idx)}
			<div class="py-2">
				<Label class={[!!form.fields.songs[idx].issues() && "text-destructive", "pb-2"]}>
					song {idx + 1}
				</Label>

				<ButtonGroup>
					<Input
						{...form.fields.songs[idx].as("text")}
						aria-errormessage="{form.fields.songs[idx].as('text').name}-error"
						aria-invalid={!!form.fields.songs[idx].issues()}
					/>

					<Button
						variant="destructive"
						type="button"
						disabled={!!form.pending}
						onclick={() => {
							removeSong(idx);
						}}
					>
						<Trash2 />
					</Button>
				</ButtonGroup>

				<InputErrors
					name={form.fields.songs[idx].as("text").name}
					errors={toErrors(form.fields.songs[idx].issues()?.map((value) => value.message) ?? [])}
				/>
			</div>
		{/each}
	</div>

	<Button type="button" disabled={songs.length >= 12} onclick={addSong}>add song</Button>

	<Button
		type="button"
		variant="destructive"
		disabled={songs.length === 0}
		onclick={removeAllSongs}
	>
		remove all songs
	</Button>

	<br />

	{#if session.current?.user.admin}
		<br />
		<br />

		<Label class="pb-2">select a profile override</Label>
		<div class="flex items-center gap-2">
			<NativeSelect {...form.fields.profileOverride.as("select", "")}>
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
			>
				<Trash2 />
			</Button>
		</div>
		<InputErrors
			name={form.fields.profileOverride.as("select").name}
			errors={toErrors(form.fields.profileOverride.issues()?.map((value) => value.message) ?? [])}
		/>

		<br />

		<Label class="pb-2">select a user override</Label>
		<div class="flex items-center gap-2">
			<NativeSelect {...form.fields.userOverride.as("select", "")}>
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
				<Trash2 />
			</Button>
		</div>
		<InputErrors
			name={form.fields.userOverride.as("select").name}
			errors={toErrors(form.fields.userOverride.issues()?.map((value) => value.message) ?? [])}
		/>
	{/if}

	<br />

	<Button type="submit" disabled={submitting}>submit</Button>
</form>
