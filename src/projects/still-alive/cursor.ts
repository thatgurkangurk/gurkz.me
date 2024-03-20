function positionTerminalCursor(currentLineElem: HTMLElement): void {
	const terminalCursor = document.getElementById("terminal_cursor");
	if (terminalCursor) {
		terminalCursor.remove();
		currentLineElem.parentNode?.insertBefore(terminalCursor, currentLineElem.nextSibling);
	}
}

export { positionTerminalCursor };
