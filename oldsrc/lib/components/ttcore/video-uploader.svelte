<script lang="ts">
	import Button from "#lib/components/button.svelte";
	import { XIcon, CircleAlert, FilmIcon, CircleCheck, UploadIcon } from "@lucide/svelte";
	import * as FileDropZone from "#lib/components/ui/file-drop-zone/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import { toast } from "svelte-sonner";
	import { CopyButton } from "../ui/copy-button";

	type UploadedFile = {
		name: string;
		size: number;
		url: string;
		thumbnailUrl: string;
		file: File;
		status: "pending" | "uploading" | "success" | "error";
	};

	let files = $state<UploadedFile[]>([]);
	let isSubmitting = $state(false);

	async function generateVideoThumbnail(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const video = document.createElement("video");
			video.preload = "metadata";
			video.src = URL.createObjectURL(file);
			video.muted = true;
			video.playsInline = true;

			video.onloadeddata = () => {
				video.currentTime = 0.1;
			};

			video.onseeked = () => {
				const canvas = document.createElement("canvas");
				canvas.width = video.videoWidth || 160;
				canvas.height = video.videoHeight || 90;
				const ctx = canvas.getContext("2d");
				ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

				const thumbnailUrl = canvas.toDataURL("image/jpeg");
				URL.revokeObjectURL(video.src);
				resolve(thumbnailUrl);
			};

			video.onerror = (err) => reject(err);
		});
	}

	async function onUpload(uploadedFiles: File[]) {
		for (const file of uploadedFiles) {
			const thumbnailUrl = await generateVideoThumbnail(file);

			const newFile: UploadedFile = {
				name: file.name,
				size: file.size,
				url: URL.createObjectURL(file),
				thumbnailUrl,
				file,
				status: "pending"
			};

			files = [...files, newFile];
		}
	}

	async function submitVideos() {
		if (files.length === 0) return;
		isSubmitting = true;

		for (let i = 0; i < files.length; i++) {
			if (files[i].status === "success") continue;

			files[i].status = "uploading";

			try {
				const formData = new FormData();
				formData.append("file", files[i].file, files[i].file.name);

				const response = await fetch("/ttcore/upload/proxy", {
					method: "POST",
					body: formData
				});

				const data = await response.json();

				if (response.ok && data.success && data.url) {
					files[i].url = data.url;
					files[i].status = "success";
				} else {
					throw new Error(data.message || "Upload failed");
				}
			} catch (error) {
				console.error(`Upload error for ${files[i].name}:`, error);
				files[i].status = "error";
			}
		}

		isSubmitting = false;
	}

	const onFileRejected: FileDropZone.FileDropZoneRootProps["onFileRejected"] = ({
		reason,
		file
	}) => {
		toast.error(`${file.name} failed to upload!`, { description: reason });
	};

	const removeFile = (index: number) => {
		URL.revokeObjectURL(files[index].url);
		files = [...files.slice(0, index), ...files.slice(index + 1)];
	};
</script>

<Card.Root class="w-full shadow-sm">
	<Card.Header class="pb-4">
		<Card.Title class="text-base font-semibold">video upload</Card.Title>
		<Card.Description>
			upload mp4 files to generate a shareable url. max file size 30mb.
		</Card.Description>
	</Card.Header>

	<Card.Content class="space-y-4">
		<FileDropZone.Root
			{onUpload}
			maxFileSize={30 * FileDropZone.MEGABYTE}
			fileCount={files.length}
			maxFiles={1}
			accept="video/*"
		>
			<FileDropZone.Trigger class="border-dashed transition-colors hover:bg-muted/50">
				<div class="flex flex-col items-center justify-center gap-1.5 py-3 text-center">
					<FilmIcon class="size-6 text-muted-foreground" />
					<p class="text-xs text-muted-foreground">
						drag & drop your video here, or <span
							class="font-medium text-foreground underline underline-offset-2">browse</span
						>
					</p>
				</div>
			</FileDropZone.Trigger>
			<FileDropZone.DragOverlay />
		</FileDropZone.Root>

		{#if files.length > 0}
			<div class="space-y-2">
				{#each files as file, i (file.name)}
					<div
						class="flex items-center justify-between gap-3 rounded-lg border bg-card p-2.5 transition-colors"
					>
						<div class="flex items-center gap-3 overflow-hidden">
							<div class="relative size-10 shrink-0 overflow-hidden rounded border bg-muted">
								<img src={file.thumbnailUrl} alt={file.name} class="h-full w-full object-cover" />
							</div>

							<div class="flex flex-col overflow-hidden text-xs">
								<span class="truncate font-medium text-foreground">{file.name}</span>
								<div class="flex items-center gap-2 text-muted-foreground">
									<span>{FileDropZone.displaySize(file.size)}</span>
									<span class="text-border">•</span>

									{#if file.status === "uploading"}
										<span class="font-medium text-blue-600">uploading...</span>
									{:else if file.status === "success"}
										<span class="inline-flex items-center gap-1 font-medium text-emerald-600">
											<CircleCheck class="size-3" /> done
										</span>
									{:else if file.status === "error"}
										<span class="inline-flex items-center gap-1 font-medium text-destructive">
											<CircleAlert class="size-3" /> failed
										</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="flex items-center gap-1">
							{#if file.status === "success"}
								<CopyButton text={file.url} />
							{/if}

							<Button
								variant="ghost"
								size="icon"
								class="size-8 text-muted-foreground hover:text-foreground"
								onclick={() => removeFile(i)}
								disabled={file.status === "uploading"}
							>
								<XIcon class="size-4" />
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>

	{#if files.length > 0}
		<Card.Footer class="flex-col gap-2 pt-2">
			<Button
				class="w-full"
				onclick={submitVideos}
				disabled={isSubmitting || files.every((f) => f.status === "success")}
			>
				{#if isSubmitting}
					uploading...
				{:else if files.every((f) => f.status === "success")}
					complete
				{:else}
					<UploadIcon class="mr-2 size-4" /> upload file
				{/if}
			</Button>
			<p class="text-center text-[11px] text-muted-foreground">
				by uploading, you agree that your video will be hosted on <a
					href="https://www.videotourl.com"
					target="_blank"
					rel="noreferrer"
					class="underline underline-offset-2 hover:text-foreground">videotourl.com</a
				>
			</p>
		</Card.Footer>
	{/if}
</Card.Root>
