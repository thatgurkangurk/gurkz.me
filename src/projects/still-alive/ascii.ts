import { z } from "zod";

const _asciiEnum = z.nativeEnum({
	APERTURE: "asciiart_aperture",
	CAKE: "asciiart_cake",
	EXPLOSION: "asciiart_explosion",
	RADIO: "asciiart_radio",
	ATOM: "asciiart_atom",
	BIOHAZARD: "asciiart_biohazard",
	BLACK_MESA: "asciiart_blackmesa",
	BROKEN_HEART: "asciiart_brokenheart",
	CHECK: "asciiart_check",
	COMPANION_CUBE: "asciiart_companioncube",
	FIRE: "asciiart_fire",
	GLADOS: "asciiart_glados",
	LIGHTBULB: "asciiart_lightbulb",
	MECHARM: "asciiart_mecharm",
	PERSONALITY_SPHERE: "asciiart_personalitysphere",
	CLEAR: "clear",
} as const);

type ASCII = z.infer<typeof _asciiEnum>;

const AsciiEnum = _asciiEnum.enum;

function changeAsciiArt(aaname: ASCII) {
	const containerAsciiArt = document.querySelector(".container_asciiart");
	if (!containerAsciiArt) return;

	const preElements = containerAsciiArt.querySelectorAll("pre");
	preElements.forEach((pre) => {
		pre.classList.remove("display");
	});

	if (aaname !== "clear") {
		const asciiartElement = containerAsciiArt.querySelector(`.${aaname}`);
		if (asciiartElement) {
			asciiartElement.classList.add("display");
		}
	}
}

export { changeAsciiArt, type ASCII, AsciiEnum };
