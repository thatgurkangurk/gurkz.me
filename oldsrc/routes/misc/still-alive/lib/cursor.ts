class Cursor {
	protected element: HTMLSpanElement;

	constructor() {
		const cursor = document.createElement("span");
		cursor.textContent = "_";
		this.element = cursor;
	}

	startBlink(interval: number) {
		setInterval(() => {
			if (!this.element.style.display || this.element.style.display === "inline-block") {
				this.element.style.display = "none";
			} else {
				this.element.style.display = "inline-block";
			}
		}, interval);

		return this;
	}

	position(currentLine: HTMLElement) {
		if (this.element) {
			this.element.remove();
		}
		currentLine.parentNode?.insertBefore(this.element, currentLine.nextSibling);
	}
}

export { Cursor };
