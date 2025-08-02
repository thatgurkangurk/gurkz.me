/**
 * Cipher logic originally by kiwibirb4life
 * Translated and cleaned by Gurkan
 */

type CipherMap = Record<string, string>;

const maps = {
	down: {
		a: "g",
		b: "h",
		c: "i",
		d: "j",
		e: "k",
		f: "l",
		g: "m",
		h: "n",
		i: "o",
		j: "p",
		k: "q",
		l: "r",
		m: "s",
		n: "t",
		o: "u",
		p: "v",
		q: "w",
		r: "x",
		s: "y",
		t: "z",
		u: "c",
		v: "a",
		w: "b",
		x: "f",
		y: "d",
		z: "e",
		" ": " ",
		",": ",",
		".": ".",
		"'": "'"
	},
	up: {
		a: "v",
		b: "w",
		c: "u",
		d: "y",
		e: "z",
		f: "x",
		g: "a",
		h: "b",
		i: "c",
		j: "d",
		k: "e",
		l: "f",
		m: "g",
		n: "h",
		o: "i",
		p: "j",
		q: "k",
		r: "l",
		s: "m",
		t: "n",
		u: "o",
		v: "p",
		w: "q",
		x: "r",
		y: "s",
		z: "t",
		" ": " ",
		",": ",",
		".": ".",
		"'": "'"
	},
	random: {
		a: "b",
		b: "c",
		c: "d",
		d: "e",
		e: "f",
		f: "g",
		g: "h",
		h: "i",
		i: "j",
		j: "k",
		k: "l",
		l: "m",
		m: "n",
		n: "o",
		o: "p",
		p: "q",
		q: "r",
		r: "s",
		s: "t",
		t: "u",
		u: "v",
		v: "w",
		w: "x",
		x: "y",
		y: "x",
		z: "a",
		" ": " ",
		",": ",",
		".": ".",
		"'": "'"
	},
	randomr: {
		a: "z",
		b: "a",
		c: "b",
		d: "c",
		e: "d",
		f: "e",
		g: "f",
		h: "g",
		i: "h",
		j: "i",
		k: "j",
		l: "k",
		m: "l",
		n: "m",
		o: "n",
		p: "o",
		q: "p",
		r: "q",
		s: "r",
		t: "s",
		u: "t",
		v: "u",
		w: "v",
		x: "w",
		y: "x",
		z: "y",
		" ": " ",
		",": ",",
		".": ".",
		"'": "'"
	}
};

function getCipherMap(index: number, reverse = false): CipherMap {
	if (index % 2 === 1) {
		return reverse ? maps.down : maps.up;
	}
	if (index % 3 === 0) {
		return reverse ? maps.up : maps.down;
	}
	return reverse ? maps.randomr : maps.random;
}

function transform(text: string, reverse = false): string {
	return text
		.toLowerCase()
		.split("")
		.map((char, i) => {
			const map = getCipherMap(i, reverse);
			return map[char] ?? char;
		})
		.join("");
}

export function encode(text: string): string {
	return transform(text, false);
}

export function decode(text: string): string {
	return transform(text, true);
}
