import { positionTerminalCursor } from "./cursor";

function typeOneByOne(targetElem: HTMLElement, text: string, duration: number, shouldAppendBR: boolean) {
	let timeoutPerChar = duration / text.length;
	const chars = text.split("");
	let charIdx = 0;

	positionTerminalCursor(targetElem);

	if (shouldAppendBR) {
		timeoutPerChar = duration / (chars.length + 1);
	}

	for (let i = 0, n = chars.length + (shouldAppendBR ? 1 : 0); i < n; i++) {
		setTimeout(() => {
			if (shouldAppendBR && charIdx === chars.length) {
				const newBR = document.createElement("br");
				newBR.classList.add("force-display");
				targetElem.parentNode?.insertBefore(newBR, targetElem.nextSibling);
				positionTerminalCursor(newBR);
			} else {
				targetElem.append(chars[charIdx++]!);
			}
		}, timeoutPerChar * i);
	}
}

export { typeOneByOne };
