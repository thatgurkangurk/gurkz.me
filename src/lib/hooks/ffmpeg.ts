import { createSignal } from "solid-js";
import type { FFmpeg } from "@ffmpeg/ffmpeg";

type Status = "loaded" | "loading" | "default";
type ConvertStatus = "converting" | "idle";

export const useFFmpeg = () => {
	const [status, setStatus] = createSignal<Status>("default");
	const [convertStatus, setConvertStatus] = createSignal<ConvertStatus>("idle");
	const [progress, setProgress] = createSignal<number | null>(null);

	let ffmpeg: FFmpeg;

	const reset = async () => {
		setStatus(() => "default");
		setProgress(() => null);
		setConvertStatus(() => "idle");

		if (ffmpeg) {
			ffmpeg.terminate();
		}
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

		const url = URL.createObjectURL(
			new Blob([data.buffer], { type: "image/gif" }),
		);

		setConvertStatus(() => "idle");

		return url;
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
