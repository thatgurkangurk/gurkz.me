import { Lyrics, renderLyric } from "./still-alive/lyrics";
import { createAsciiArt } from "./still-alive/ascii";

const CREDIT_DATA = [
	">LIST PERSONNEL",
	"",
	"",
	"Gautam Babbar",
	"Ted Backman",
	"Kelly Bailey",
	"Jeff Ballinger",
	"Aaron Barber",
	"Jeep Barnett",
	"Jeremy Bennett",
	"Dan Berger",
	"Yahn Bernier",
	"Ken Birdwell",
	"Derrick Birum",
	"Mike Blaszczak",
	"Iestyn Bleasdale-Shepherd",
	"Chris Bokitch",
	"Steve Bond",
	"Matt Boone",
	"Antoine Bourdon",
	"Jamaal Bradley",
	"Jason Brashill",
	"Charlie Brown",
	"Charlie Burgin",
	"Andrew Burke",
	"Augusta Butlin",
	"Julie Caldwell",
	"Dario Casali",
	"Chris Chin",
	"Jess Cliffe",
	"Phil Co",
	"John Cook",
	"Christen Coomer",
	"Greg Coomer",
	"Scott Dalton",
	"Kerry Davis",
	"Jason Deakins",
	"Joe Demers",
	"Ariel Diaz",
	"Quintin Doroquez",
	"Jim Dose",
	"Chris Douglass",
	"Laura Dubuk",
	"Mike Dunkle",
	"Mike Durand",
	"Mike Dussault",
	"Dhabih Eng",
	"Katie Engel",
	"Chet Faliszek",
	"Adrian Finol",
	"Bill Fletcher",
	"Moby Francke",
	"Stephane Gaudette",
	"Kathy Gehrig",
	"Vitaliy Genkin",
	"Paul Graham",
	"Chris Green",
	"Chris Grinstead",
	"John Guthrie",
	"Aaron Halifax",
	"Reagan Halifax",
	"Leslie Hall",
	"Jeff Hameluck",
	"Joe Han",
	"Don Holden",
	"Jason Holtman",
	"Gray Horsfield",
	"Keith Huggins",
	"Jim Hughes",
	"Jon Huisingh",
	"Brian Jacobson",
	"Lars Jensvold",
	"Erik Johnson",
	"Jakob Jungels",
	"Rich Kaethler",
	"Steve Kalning",
	"Aaron Kearly",
	"Iikka Keranen",
	"David Kircher",
	"Eric Kirchmer",
	"Scott Klintworth",
	"Alden Kroll",
	"Marc Laidlaw",
	"Jeff Lane",
	"Tim Larkin",
	"Dan LeFree",
	"Isabelle LeMay",
	"Tom Leonard",
	"Jeff Lind",
	"Doug Lombardi",
	"Bianca Loomis",
	"Richard Lord",
	"Realm Lovejoy",
	"Randy Lundeen",
	"Scott Lynch",
	"Ido Magal",
	"Nick Maggiore",
	"John McCaskey",
	"Patrick McClard",
	"Steve McClure",
	"Hamish McKenzie",
	"Gary McTaggart",
	"Jason Mitchell",
	"Mike Morasky",
	"John Morello II",
	"Bryn Moslow",
	"Arsenio Navarro",
	"Gabe Newell",
	"Milton Ngan",
	"Jake Nicholson",
	"Martin Otten",
	"Nick Papineau",
	"Karen Prell",
	"Bay Raitt",
	"Tristan Reidford",
	"Alfred Reynolds",
	"Matt Rhoten",
	"Garret Rickey",
	"Dave Riller",
	"Elan Ruskin",
	"Matthew Russell",
	"Jason Ruymen",
	"David Sawyer",
	"Marc Scaparro",
	"Wade Schin",
	"Matthew Scott",
	"Aaron Seeler",
	"Jennifer Seeley",
	"Taylor Sherman",
	"Eric Smith",
	"Jeff Sorensen",
	"David Speyrer",
	"Jay Stelly",
	"Jeremy Stone",
	"Eric Strand",
	"Kim Swift",
	"Kelly Thornton",
	"Eric Twelker",
	"Carl Uhlman",
	"Doug Valente",
	"Bill Van Buren",
	"Gabe Van Engel",
	"Alex Vlachos",
	"Robin Walker",
	"Joshua Weier",
	"Andrea Wicklund",
	"Greg Winkler",
	"Erik Wolpaw",
	"Doug Wood",
	"Matt T. Wood",
	"Danika Wright",
	"Matt Wright",
	"Shawn Zabecki",
	"Torsten Zabka ",
	"",
	"",
	"",
	"",
	"'Still Alive' by:",
	"Jonathan Coulton",
	"",
	"",
	"",
	"Voices:",
	"Ellen McLain - GlaDOS, Turrets",
	"Mike Patton - THE ANGER SPHERE",
	"",
	"",
	"",
	"Voice Casting:",
	"Shana LandsburgTeri Fiddleman",
	"",
	"",
	"",
	"",
	"Voice Recording:",
	"Pure Audio, Seattle, WA",
	"",
	"",
	"",
	"",
	"Voice recording",
	"scheduling and logistics:",
	"Pat Cockburn, Pure Audio",
	"",
	"",
	"",
	"",
	"Translations:",
	"SDL",
	"",
	"",
	"",
	"",
	"Crack Legal Team:",
	"Liam Lavery",
	"Karl Quackenbush",
	"Kristen Boraas",
	"Kevin Rosenfield",
	"Alan Bruggeman",
	"Dennis Tessier",
	"",
	"",
	"",
	"Thanks for the use of their face:",
	"Alesia Glidewell - Chell",
	"",
	"",
	"",
	"Special thanks to everyone at:",
	"Alienware",
	"ATI",
	"Dell",
	"Falcon Northwest",
	"Havok",
	"SOFTIMAGE",
	"and Don Kemmis, SLK Technologies",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"THANK YOU FOR PARTICIPATING",
	"IN THIS",
	"ENRICHMENT CENTER ACTIVITY!!",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
	"",
];

const CREDIT_CHARACTER_VELOCITY_MS = 68.623562;
let creditCurrentPosition = 0;

const TERMINAL_CURSOR_BLINK_INTERVAL = 300;
const terminalCursorElem = document.createElement("span");
terminalCursorElem.id = "terminal_cursor";
terminalCursorElem.textContent = "_";

const terminalCreditCursorElem = document.createElement("span");
terminalCreditCursorElem.id = "terminal_cursor_credit";
terminalCreditCursorElem.textContent = "_";

createAsciiArt();

const containerLyricsBeforeLoading = document.querySelector(".container_lyrics_before_loading>span");
if (containerLyricsBeforeLoading instanceof HTMLElement) {
	positionTerminalCursor(containerLyricsBeforeLoading);
}

startBlinkTerminalCursor();
setTimeout(() => {
	const containerCredits = document.querySelector(".container_credits");
	if (containerCredits instanceof HTMLElement) {
		for (let i = 0, len = 16; i < len; i++) {
			const spanElement = document.createElement("span");
			spanElement.className = `row row${i}`;
			spanElement.id = `row${i}`;
			containerCredits.appendChild(spanElement);

			if (i !== len - 1) {
				const brElement = document.createElement("br");
				brElement.className = "force-display";
				containerCredits.appendChild(brElement);
			}
		}

		containerCredits.appendChild(terminalCreditCursorElem);
		positionCreditTerminalCursor(document.querySelector(".container_credits>span.row15")!);
		startBlinkCreditTerminalCursor();
	}
}, TERMINAL_CURSOR_BLINK_INTERVAL);
const stillAliveBGM = new Audio(
	"https://github.com/thatgurkangurk/gurkz.me/raw/projects/still-alive/public/stillalive/stillalive.m4a",
);
if (stillAliveBGM) {
	stillAliveBGM.addEventListener("canplaythrough", (e) => {
		e.preventDefault();
		const containerLyricsBeforeLoading = document.querySelector(".container_lyrics_before_loading");
		if (containerLyricsBeforeLoading) {
			containerLyricsBeforeLoading.remove();
		}

		const containerLyricsBeforeMobile: HTMLDivElement | null = document.querySelector(
			".container_lyrics_before_mobile",
		);
		if (containerLyricsBeforeMobile) {
			containerLyricsBeforeMobile.style.display = "block";
			const containerLyricsBeforeMobileSpan = containerLyricsBeforeMobile.querySelector("span");
			if (containerLyricsBeforeMobileSpan) {
				positionTerminalCursor(containerLyricsBeforeMobileSpan);
			}
		}
	});
}

const containerLyricsBeforeMobileLink = document.querySelector(".container_lyrics_before_mobile>button");
if (containerLyricsBeforeMobileLink) {
	containerLyricsBeforeMobileLink.addEventListener("click", (e) => {
		e.preventDefault();
		const containerLyricsBeforeMobile = document.querySelector(".container_lyrics_before_mobile");
		if (containerLyricsBeforeMobile) {
			containerLyricsBeforeMobile.remove();
		}

		startTypingCurrentLyrics();

		const stillAliveBGM = document.getElementById("stillalive_bgm") as HTMLAudioElement;
		if (stillAliveBGM) {
			stillAliveBGM.play();
			stillAliveBGM.muted = true;

			setTimeout(() => {
				stillAliveBGM.muted = false;
				stillAliveBGM.currentTime = 0;
			}, 6750);
			setTimeout(() => {
				startTypingCredits();
			}, 9000);
		}
	});
}

function startTypingCurrentLyrics() {
	Lyrics.forEach((section) => {
		setTimeout(() => {
			const currentLyrics = document.querySelector(".container_lyrics");
			if (currentLyrics) {
				currentLyrics.remove();
			}

			const newLyrics = document.createElement("div");
			newLyrics.classList.add("container_lyrics");
			document.body.appendChild(newLyrics);

			section.lyrics.forEach((lyric) => {
				renderLyric(lyric, newLyrics);
			});
		}, parseInt(section.start));
	});
}

function positionTerminalCursor(currentLineElem: HTMLElement): void {
	const terminalCursor = document.getElementById("terminal_cursor");
	if (terminalCursor) {
		terminalCursor.remove();
		currentLineElem.parentNode?.insertBefore(terminalCursor, currentLineElem.nextSibling);
	}
}

function startBlinkTerminalCursor(): void {
	setInterval(() => {
		if (!terminalCursorElem.style.display || terminalCursorElem.style.display === "inline-block") {
			terminalCursorElem.style.display = "none";
		} else {
			terminalCursorElem.style.display = "";
		}
	}, TERMINAL_CURSOR_BLINK_INTERVAL);
}

function startBlinkCreditTerminalCursor(): void {
	setInterval(() => {
		if (!terminalCreditCursorElem.style.display || terminalCreditCursorElem.style.display === "inline-block") {
			terminalCreditCursorElem.style.display = "none";
		} else {
			terminalCreditCursorElem.style.display = "";
		}
	}, TERMINAL_CURSOR_BLINK_INTERVAL);
}

function positionCreditTerminalCursor(currentLineElem: Element) {
	const terminalCreditCursor = document.getElementById("terminal_cursor_credit");
	if (terminalCreditCursor) {
		terminalCreditCursor.remove();
	}
	currentLineElem.parentNode?.insertBefore(terminalCreditCursorElem, currentLineElem.nextSibling);
}

function typeCreditOneByOne(text: string, duration: number) {
	const targetElem = document.querySelector(".container_credits>span.row15");
	if (!targetElem) return;

	targetElem.textContent = "";

	if (text !== "") {
		const timeoutPerChar = duration / text.length;
		const chars = text.split("");
		let charIdx = 0;

		positionCreditTerminalCursor(targetElem);

		for (let i = 0, n = chars.length + 1; i < n; i++) {
			setTimeout(() => {
				const textToAdd = `${chars[charIdx++]}`.replace("undefined", "");
				const textNode = document.createTextNode(textToAdd);
				targetElem.appendChild(textNode);

				if (charIdx === chars.length + 1) startTypingCredits();
			}, timeoutPerChar * i);
		}
	} else {
		setTimeout(startTypingCredits, duration);
	}
}

function startTypingCredits() {
	if (creditCurrentPosition < CREDIT_DATA.length) {
		const curCredit = CREDIT_DATA[creditCurrentPosition] || "";

		// Select the container for credits
		const containerCredits = document.querySelector(".container_credits");
		if (!containerCredits) return;

		// Update the content of each row in the credits container
		for (let i = 1, l = 16; i < l; i++) {
			const prevRowText = (containerCredits.querySelector(".row" + i) as HTMLElement)?.innerText;
			if (prevRowText !== undefined) {
				(containerCredits.querySelector(".row" + (i - 1)) as HTMLElement).innerText = prevRowText;
			}
		}

		// Calculate typing duration based on the length of the credit text
		const typingDuration = CREDIT_CHARACTER_VELOCITY_MS * (curCredit === "" ? 1 : curCredit.length);

		// Type the current credit one by one
		typeCreditOneByOne(curCredit, typingDuration);

		// Move to the next credit
		creditCurrentPosition++;
	}
}
