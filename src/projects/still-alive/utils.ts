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

/**
 * safely parses a string to valid ASCII art
 * @param input the string to parse
 * @returns the parsed ascii art (defaults to clear if the input is invalid)
 */
function parseStringToAsciiArt(input: string): ASCII {
	const result = _asciiEnum.safeParse(input);

	if (!result.success) {
		console.error("ASCII art parsing failed. Clearing.");
		return _asciiEnum.enum.CLEAR;
	}

	return result.data;
}

type ASCII = z.infer<typeof _asciiEnum>;

const AsciiEnum = _asciiEnum.enum;

export { type ASCII, parseStringToAsciiArt, AsciiEnum };
