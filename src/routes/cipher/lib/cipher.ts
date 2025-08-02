/**
 * Cipher logic originally by kiwibirb4life
 * Translated and cleaned by Gurkan
 */

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const UP_KEY = "vwuyzxabcdefghijklmnopqrst";
const DOWN_KEY = "ghijklmnopqrstuvwxyzcabfde";

function mapTypeForIndex(i: number): 0 | 1 | 2 {
	if (i % 2 === 1) return 0;
	if (i % 3 === 0) return 1;
	return 2;
}

function transform(text: string, decode = false): string {
	let out = "";

	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		const lower = ch.toLowerCase();
		const pos = ALPHABET.indexOf(lower);

		if (pos !== -1) {
			const type = mapTypeForIndex(i);
			let mapped: string;

			if (type === 0) {
				const key = decode ? DOWN_KEY : UP_KEY;
				mapped = key[pos];
			} else if (type === 1) {
				const key = decode ? UP_KEY : DOWN_KEY;
				mapped = key[pos];
			} else {
				if (!decode) {
					mapped = ALPHABET[(pos + 1) % 26];
				} else {
					mapped = ALPHABET[(pos + 25) % 26];
				}
			}

			out += ch === lower ? mapped : mapped.toUpperCase();
		} else {
			out += ch;
		}
	}

	return out;
}

export const encode = (s: string) => transform(s, false);
export const decode = (s: string) => transform(s, true);
