import { clientOnly } from "@solidjs/start";
import { Suspense } from "solid-js";
import VideoGifConverter from "~/components/projects/video-to-gif";

export default function VideoToGif() {
	return (
		<>
			<noscript>this project needs javascript, sorry</noscript>
			<VideoGifConverter />
		</>
	);
}
