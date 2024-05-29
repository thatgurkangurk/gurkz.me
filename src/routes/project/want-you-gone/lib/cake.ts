import { lyrics } from "./lyrics";
import { credits } from "./credits";
import { createTimeout } from "$lib/utils/timeouts";

export class Cake {
	private delayMultiplier = 1000;
	private creditsStartTime = 0;
	private creditsMaxTime = 144;
	private blinkerTime = 0.3 * 1000;
	private maxCredits = 13;
	private firstLyricsIndex = 0;
	private lastCreditsIndex = 0;
	private creditsDelay = 0;

	lyricsDiv: HTMLDivElement;
	creditsDiv: HTMLDivElement;
	player: HTMLAudioElement;

	lyricsCursor!: HTMLSpanElement;
	creditsCursor!: HTMLSpanElement;
	lyricsText: HTMLDivElement;
	creditsText: HTMLDivElement;

	constructor(
		lyricsDiv: HTMLDivElement,
		creditsDiv: HTMLDivElement,
		lyricsText: HTMLDivElement,
		creditsText: HTMLDivElement,
		player: HTMLAudioElement
	) {
		this.lyricsDiv = lyricsDiv;
		this.creditsDiv = creditsDiv;
		this.player = player;
		this.lyricsText = lyricsText;
		this.creditsText = creditsText;
	}

	public start() {
		this.initCursors();
		this.player.play();

		this.processLyricLines();
		this.processCreditLines();
	}

	initCursors() {
		if (!this.lyricsCursor) {
			this.lyricsCursor = document.createElement("span");
			this.lyricsText.appendChild(this.lyricsCursor);
			this.blink(this.lyricsCursor);
		}
		if (!this.creditsCursor) {
			this.creditsCursor = document.createElement("span");
			this.creditsText.appendChild(this.creditsCursor);
			this.blink(this.creditsCursor);
		}
	}

	blink(cursor: HTMLSpanElement) {
		let nextChar = cursor.innerHTML;
		let newChar = "_";
		if (nextChar == "_") newChar = "&nbsp;";
		if (nextChar == "&nbsp;") newChar = "_";
		cursor.innerHTML = newChar;
		createTimeout(
			"want-you-gone",
			() => {
				this.blink(cursor);
			},
			this.blinkerTime
		);
	}

	processLetter(type: string, lineIdx: number, letter: string) {
		const line = document.getElementById(`${type}${lineIdx}`);
		if (line) {
			if (letter === "newline") {
				line.appendChild(document.createElement("br"));
			} else {
				if (letter == "<") letter = "&lt;";
				if (letter == ">") letter = "&gt;";
				if (letter == " ") letter = "&nbsp;";
				line.innerHTML = `${line.innerHTML}${letter}`;
			}
		}
	}

	processLyricLine(idx: number) {
		if (idx < this.firstLyricsIndex) return;
		let lastLineDiv: HTMLDivElement | null = null;

		for (
			let lastIndex = idx - 1;
			lastIndex >= 0 && !lastLineDiv && lyrics[lastIndex].clear === false;
			lastIndex--
		) {
			lastLineDiv = document.getElementById("lyrics" + lastIndex) as HTMLDivElement | null;
		}

		const newLyrics = document.createElement("span");
		newLyrics.id = "lyrics" + idx;
		if (lastLineDiv) {
			this.lyricsText.appendChild(newLyrics);
			this.lyricsText.insertBefore(newLyrics, this.lyricsCursor);
			this.lyricsText.insertBefore(lastLineDiv, newLyrics);
		} else {
			let nextLineDiv: HTMLSpanElement | null = null;
			for (let nextIndex = idx + 1; nextIndex < idx + 50 && !nextLineDiv; nextIndex++) {
				nextLineDiv = document.getElementById("lyrics" + nextIndex) as HTMLSpanElement;
			}
			if (nextLineDiv) {
				this.lyricsText.appendChild(nextLineDiv);
				this.lyricsText.insertBefore(nextLineDiv, newLyrics);
			} else {
				this.lyricsText.insertBefore(newLyrics, this.lyricsCursor);
			}
		}

		const curlyric = lyrics[idx];

		const clear = curlyric["clear"];
		if (clear === true) {
			this.clearLyrics();
			this.firstLyricsIndex = idx;
		} else {
			const text = curlyric["text"];
			const delay = curlyric["delay"] * this.delayMultiplier;
			let letterdelay = 0;
			if (text.length > 0) {
				letterdelay = delay / (text.length + 1);
			}
			for (let x = 0; x < text.length; x++) {
				const timeout = createTimeout(
					"want-you-gone",
					() => this.processLetter("lyrics", idx, text.substring(x, x + 1)),
					letterdelay * x
				);
			}
			if (curlyric["newLine"] === true) {
				const timeout = createTimeout(
					"want-you-gone",
					() => this.processLetter("lyrics", idx, "newline"),
					letterdelay * text.length
				);
			}
		}
	}

	processLyricLines() {
		let delay = 0;
		for (let idx = 0; idx < lyrics.length; idx++) {
			createTimeout("want-you-gone", () => this.processLyricLine(idx), delay);
			delay += lyrics[idx]["delay"] * this.delayMultiplier;
		}
	}

	clearLyrics() {
		this.lyricsText.innerHTML = "";
		this.lyricsText.appendChild(this.lyricsCursor);
	}

	initCredits() {
		for (let idx = 0 - this.maxCredits; idx < 0; idx++) {
			const newCredits = document.createElement("div");
			newCredits.id = `credits${idx}`;
			newCredits.innerHTML = "&nbsp;";
			this.creditsText.appendChild(newCredits);
		}
	}

	processCreditLine(idx: number) {
		for (
			let lastIdx = this.lastCreditsIndex - this.maxCredits;
			lastIdx >= 0 - this.maxCredits;
			lastIdx--
		) {
			const pastLineDiv = document.getElementById(`credits${lastIdx}`) as HTMLDivElement;
			if (pastLineDiv) this.creditsText.removeChild(pastLineDiv);
			else break;
		}

		if (idx < this.lastCreditsIndex - this.maxCredits) return;

		let lastLineDiv: HTMLDivElement | null = null;

		for (let lastIdx = idx - 1; lastIdx >= 0 && !lastLineDiv; lastIdx--) {
			lastLineDiv = document.getElementById(`credits${lastIdx}`) as HTMLDivElement;
		}
		const newCredits = document.createElement("span");
		newCredits.id = `credits${idx}`;

		if (lastLineDiv) {
			this.creditsText.insertBefore(newCredits, lastLineDiv.nextSibling);
		} else {
			this.creditsText.insertBefore(newCredits, this.creditsCursor);
		}

		if (idx > this.lastCreditsIndex) this.lastCreditsIndex = idx;

		const text = credits[idx];
		for (let x = 0; x < text.length; x++) {
			createTimeout(
				"want-you-gone",
				() => this.processLetter("credits", idx, text.substring(x, x + 1)),
				this.creditsDelay * x
			);
		}

		if (idx < credits.length - 1)
			createTimeout(
				"want-you-gone",
				() => this.processLetter("credits", idx, "newline"),
				this.creditsDelay * text.length
			);
	}

	processCreditLines() {
		let totalchars = 0;
		for (let idx = 0; idx < credits.length; idx++) {
			totalchars += credits[idx].length + 1;
		}
		this.creditsDelay = (this.creditsMaxTime * this.delayMultiplier) / totalchars;

		let delay = this.creditsStartTime * this.delayMultiplier;
		for (let idx = 0; idx < credits.length; idx++) {
			createTimeout("want-you-gone", () => this.processCreditLine(idx), delay);
			delay += credits[idx].length * this.creditsDelay;
		}
	}
}
