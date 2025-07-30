import type { Snippet } from "svelte";
import type { Attachment } from "svelte/attachments";

export function copy({
	content,
	onCopy
}: {
	content: string;
	onCopy?: () => void;
}): Attachment<HTMLElement> {
	return (element) => {
		const controller = new AbortController();
		element.addEventListener(
			"click",
			() => {
				navigator.clipboard.writeText(content).catch((error) => {
					console.error("Failed to copy to clipboard:", error);
					return;
				});
				onCopy?.();
			},
			{
				signal: controller.signal
			}
		);

		return () => {
			controller.abort();
		};
	};
}
