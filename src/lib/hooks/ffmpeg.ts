import { createSignal } from "solid-js";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

type Status = "loaded" | "loading" | "default";
type ConvertStatus = "converting" | "idle";

export function bytesToSize(bytes: number): string {
	const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes === 0) return "n/a";
	const i: number = Number.parseInt(
		Math.floor(Math.log(bytes) / Math.log(1024)).toString(),
	);
	if (i === 0) return `${bytes} ${sizes[i]}`;
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

export const useFFmpeg = () => {
	const [status, setStatus] = createSignal<Status>("default");
	const [convertStatus, setConvertStatus] = createSignal<ConvertStatus>("idle");
	const [progress, setProgress] = createSignal<number | null>(null);

	let ffmpeg: FFmpeg;

	const reset = async () => {
		setStatus(() => (ffmpeg ? "loaded" : "default"));
		setProgress(() => null);
		setConvertStatus(() => "idle");
	};

	const load = async () => {
		const { toBlobURL } = await import("@ffmpeg/util");
		const { FFmpeg } = await import("@ffmpeg/ffmpeg");

		if (status() !== "default") {
			console.warn("attempted to load ffmpeg again");
			return;
		}

		if (!ffmpeg) {
			ffmpeg = new FFmpeg();
		}

		ffmpeg.on("log", (msg) => {
			console.log(msg.message);
		});

		ffmpeg.on("progress", ({ progress, time }) => {
			setProgress(() => Math.floor(progress * 100));
		});

		setStatus(() => "loading");
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
		await ffmpeg
			.load({
				coreURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.js`,
					"text/javascript",
				),
				wasmURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.wasm`,
					"application/wasm",
				),
			})
			.then(() => setStatus(() => "loaded"));
	};

	const convertToGif = async (file: File) => {
		setConvertStatus(() => "converting");
		const { fetchFile } = await import("@ffmpeg/util");
		await ffmpeg?.writeFile("input.mp4", await fetchFile(file));

		await ffmpeg?.exec(["-i", "input.mp4", "-f", "gif", "out.gif"]);

		const data = (await ffmpeg?.readFile("out.gif")) as unknown as {
			buffer: Buffer;
		};

		const blob = new Blob([data.buffer], { type: "image/gif" });

		const url = URL.createObjectURL(blob);

		setConvertStatus(() => "idle");

		return {
			url: url,
			size: bytesToSize(blob.size),
		};
	};

	return {
		status,
		load,
		convertToGif,
		convertStatus,
		reset,
		progress,
	};
};
