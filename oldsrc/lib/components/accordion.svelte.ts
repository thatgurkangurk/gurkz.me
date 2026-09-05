import type { Attachment } from "svelte/attachments";

export const accordion: Attachment<HTMLDetailsElement> = (node) => {
	let isAnimating = false;

	const summary = node.querySelector("summary");
	const content = node.querySelector(".details-content") as HTMLElement;

	if (!summary || !content) return;

	function handleClick(e: MouseEvent) {
		// let link clicks inside summary act normally
		if ((e.target as HTMLElement).closest("a")) return;

		e.preventDefault();

		if (isAnimating) return;

		if (node.open) {
			// SLIDE OUT / CLOSE
			isAnimating = true;
			const startHeight = `${content.offsetHeight}px`;
			const anim = content.animate(
				[
					{ height: startHeight, opacity: "1" },
					{ height: "0px", opacity: "0" }
				],
				{ duration: 250, easing: "ease-out" }
			);

			anim.onfinish = () => {
				node.open = false;
				isAnimating = false;
			};
		} else {
			// SLIDE IN / OPEN
			node.open = true;
			isAnimating = true;
			const endHeight = `${content.scrollHeight}px`;
			const anim = content.animate(
				[
					{ height: "0px", opacity: "0" },
					{ height: endHeight, opacity: "1" }
				],
				{ duration: 250, easing: "ease-out" }
			);

			anim.onfinish = () => {
				isAnimating = false;
			};
		}
	}

	summary.addEventListener("click", handleClick);

	return () => {
		summary.removeEventListener("click", handleClick);
	};
};
