import { positionTerminalCursor } from "./cursor";
import { typeOneByOne } from "./text";
import { AsciiEnum, type ASCII, changeAsciiArt } from "./ascii";

type Lyric =
	| {
			type: "text";
			start: string;
			duration: string;
			appendBr: boolean;
			text: string;
			ascii?: ASCII;
	  }
	| {
			type: "br";
			showOffset: string;
	  }
	| {
			type: "link";
			start: string;
			duration: string;
			appendBr: boolean;
			text: string;
			href: string;
			ascii?: ASCII;
	  };

const Section1: Lyric[] = [
	{ type: "text", start: "0", duration: "2000", appendBr: false, text: "Forms FORM-29827281-12:" },
	{ type: "text", start: "2000", duration: "2000", appendBr: true, text: "Test Assessment Report" },
	{ type: "br", showOffset: "4010" },
	{ type: "br", showOffset: "4020" },
	{ type: "text", start: "6870", duration: "2050", appendBr: true, text: "This was a triumph." },
	{ type: "text", start: "10820", duration: "2100", appendBr: true, text: "I'm making a note here:" },
	{ type: "text", start: "12930", duration: "1800", appendBr: true, text: "HUGE SUCCESS." },
	{ type: "text", start: "15730", duration: "2360", appendBr: true, text: "It's hard to overstate" },
	{ type: "text", start: "18130", duration: "2710", appendBr: true, text: "my satisfaction." },
	{
		type: "text",
		start: "22970",
		duration: "1760",
		appendBr: true,
		text: "Aperture Science",
		ascii: AsciiEnum.APERTURE,
	},
	{ type: "text", start: "26830", duration: "1570", appendBr: true, text: "We do what we must" },
	{ type: "text", start: "28600", duration: "1460", appendBr: false, text: "because we can." },
	{ type: "text", start: "31930", duration: "1550", appendBr: false, text: "For the good" },
	{ type: "text", start: "33480", duration: "1530", appendBr: true, text: "of all of us." },
	{
		type: "text",
		start: "35289",
		duration: "1741",
		appendBr: true,
		text: "Except the ones who are dead.",
		ascii: AsciiEnum.BIOHAZARD,
	},
	{ type: "text", start: "37030", duration: "400", appendBr: true, text: "" },
	{
		type: "text",
		start: "37430",
		duration: "1858",
		appendBr: true,
		text: "But there's no sense crying",
		ascii: AsciiEnum.APERTURE,
	},
	{ type: "text", start: "39298", duration: "1782", appendBr: true, text: "over every mistake." },
	{ type: "text", start: "41280", duration: "1985", appendBr: true, text: "You just keep on trying" },
	{ type: "text", start: "43275", duration: "1366", appendBr: false, text: "till you run out of" },
	{ type: "text", start: "44641", duration: "400", appendBr: true, text: "cake." },
	{
		type: "text",
		start: "45227",
		duration: "1970",
		appendBr: true,
		text: "And the Science gets done.",
		ascii: AsciiEnum.ATOM,
	},
	{ type: "text", start: "47197", duration: "1970", appendBr: true, text: "And you make a neat gun." },
	{
		type: "text",
		start: "49187",
		duration: "1520",
		appendBr: true,
		text: "For the people who are",
		ascii: AsciiEnum.APERTURE,
	},
	{ type: "text", start: "50727", duration: "1500", appendBr: true, text: "still alive." },
];

const Section2: Lyric[] = [
	{ type: "text", start: "0", duration: "550", appendBr: true, text: "Forms FORM-55551-5:" },
	{ type: "text", start: "550", duration: "1100", appendBr: true, text: "Personnel File Addendum:" },
	{ type: "br", showOffset: "1650" },
	{ type: "text", start: "2310", duration: "2350", appendBr: true, text: "Dear <<Subject Name Here>>," },
	{ type: "br", showOffset: "4660" },
	{ type: "text", start: "4720", duration: "1917", appendBr: true, text: "I'm not even angry." },
	{ type: "text", start: "9005", duration: "697", appendBr: false, text: "I'm being" },
	{ type: "text", start: "9702", duration: "650", appendBr: false, text: "so" },
	{ type: "text", start: "10352", duration: "906", appendBr: false, text: "sincere" },
	{ type: "text", start: "11258", duration: "1115", appendBr: true, text: "right now." },
	{ type: "text", start: "13998", duration: "650", appendBr: false, text: "Even" },
	{ type: "text", start: "14648", duration: "1347", appendBr: false, text: "though you" },
	{ type: "text", start: "15995", duration: "488", appendBr: false, text: "broke", ascii: AsciiEnum.BROKEN_HEART },
	{ type: "text", start: "16483", duration: "998", appendBr: true, text: "my heart." },
	{ type: "text", start: "17481", duration: "325", appendBr: false, text: "And" },
	{ type: "text", start: "17806", duration: "488", appendBr: false, text: "killed" },
	{ type: "text", start: "18294", duration: "557", appendBr: true, text: "me." },
	{
		type: "text",
		start: "20851",
		duration: "1649",
		appendBr: true,
		text: "And tore me to pieces.",
		ascii: AsciiEnum.EXPLOSION,
	},
	{ type: "text", start: "24822", duration: "1440", appendBr: false, text: "And threw every piece" },
	{ type: "text", start: "26264", duration: "580", appendBr: false, text: "into" },
	{ type: "text", start: "27239", duration: "882", appendBr: true, text: "a fire.", ascii: AsciiEnum.FIRE },
	{ type: "text", start: "29770", duration: "1400", appendBr: false, text: "As they burned" },
	{ type: "text", start: "31170", duration: "1509", appendBr: true, text: "it hurt because" },
	{
		type: "text",
		start: "33004",
		duration: "1625",
		appendBr: true,
		text: "I was so happy for you!",
		ascii: AsciiEnum.CHECK,
	},
	{ type: "text", start: "35070", duration: "2067", appendBr: true, text: "Now these points of data" },
	{ type: "text", start: "37137", duration: "1950", appendBr: true, text: "make a beautiful line." },
	{ type: "text", start: "39087", duration: "2020", appendBr: true, text: "And we're out of beta." },
	{ type: "text", start: "41107", duration: "1950", appendBr: true, text: "We're releasing on time." },
	{
		type: "text",
		start: "43057",
		duration: "2113",
		appendBr: true,
		text: "So I'm GLaD. I got burned.",
		ascii: AsciiEnum.EXPLOSION,
	},
	{
		type: "text",
		start: "45170",
		duration: "2020",
		appendBr: true,
		text: "Think of all the things we learned",
		ascii: AsciiEnum.ATOM,
	},
	{
		type: "text",
		start: "47190",
		duration: "1556",
		appendBr: true,
		text: "for the people who are",
		ascii: AsciiEnum.APERTURE,
	},
	{ type: "text", start: "48746", duration: "395", appendBr: false, text: "still" },
	{ type: "text", start: "49141", duration: "1440", appendBr: true, text: "alive." },
];

const Section3: Lyric[] = [
	{ type: "text", start: "0", duration: "450", appendBr: true, text: "Forms FORM-55551-6:" },
	{ type: "text", start: "451", duration: "1310", appendBr: true, text: "Personnel File Addendum Addendum:" },
	{ type: "br", showOffset: "1760" },
	{ type: "text", start: "2420", duration: "2200", appendBr: true, text: "One last thing:" },
	{ type: "br", showOffset: "4620" },
	{ type: "text", start: "4670", duration: "1324", appendBr: false, text: "Go ahead and leave" },
	{ type: "text", start: "5994", duration: "627", appendBr: true, text: "me." },
	{ type: "text", start: "8409", duration: "534", appendBr: false, text: "I think" },
	{ type: "text", start: "8943", duration: "1184", appendBr: false, text: "I prefer" },
	{ type: "text", start: "10127", duration: "1022", appendBr: false, text: "to stay" },
	{ type: "text", start: "11149", duration: "232", appendBr: false, text: "in" },
	{ type: "text", start: "11381", duration: "882", appendBr: true, text: "side." },
	{ type: "text", start: "13693", duration: "511", appendBr: false, text: "May" },
	{ type: "text", start: "14204", duration: "2972", appendBr: true, text: "be you'll find someone else" },
	{ type: "text", start: "17176", duration: "1254", appendBr: true, text: "to help you." },
	{ type: "text", start: "20682", duration: "511", appendBr: false, text: "Maybe" },
	{ type: "text", start: "21193", duration: "325", appendBr: false, text: "Black", ascii: AsciiEnum.BLACK_MESA },
	{ type: "text", start: "21518", duration: "998", appendBr: false, text: "Mesa" },
	{ type: "text", start: "22516", duration: "2183", appendBr: true, text: "..." },
	{ type: "text", start: "24699", duration: "1440", appendBr: false, text: "THAT WAS A JOKE." },
	{ type: "text", start: "27160", duration: "279", appendBr: false, text: "FAT" },
	{ type: "text", start: "27439", duration: "859", appendBr: true, text: "CHANCE." },
	{ type: "text", start: "29691", duration: "1486", appendBr: false, text: "Anyway" },
	{
		type: "text",
		start: "31177",
		duration: "1765",
		appendBr: true,
		text: ", this cake is great.",
		ascii: AsciiEnum.CAKE,
	},
	{ type: "text", start: "32942", duration: "1904", appendBr: true, text: "It's so delicious and moist." },
	{
		type: "text",
		start: "35264",
		duration: "1927",
		appendBr: true,
		text: "Look at me still talking",
		ascii: AsciiEnum.GLADOS,
	},
	{
		type: "text",
		start: "37191",
		duration: "2090",
		appendBr: true,
		text: "when there's Science to do.",
		ascii: AsciiEnum.BIOHAZARD,
	},
	{
		type: "text",
		start: "39281",
		duration: "1695",
		appendBr: true,
		text: "When I look out there,",
		ascii: AsciiEnum.APERTURE,
	},
	{ type: "text", start: "40976", duration: "2183", appendBr: true, text: "it makes me GLaD I'm not you." },
	{
		type: "text",
		start: "43159",
		duration: "2043",
		appendBr: true,
		text: "I've experiments to run.",
		ascii: AsciiEnum.ATOM,
	},
	{
		type: "text",
		start: "45202",
		duration: "2020",
		appendBr: true,
		text: "There is research to be done.",
		ascii: AsciiEnum.EXPLOSION,
	},
	{
		type: "text",
		start: "47222",
		duration: "1625",
		appendBr: true,
		text: "On the people who are",
		ascii: AsciiEnum.APERTURE,
	},
	{ type: "text", start: "48847", duration: "348", appendBr: false, text: "still" },
	{ type: "text", start: "49195", duration: "1440", appendBr: true, text: "alive." },
];

const Section4: Lyric[] = [
	{ type: "br", showOffset: "110" },
	{ type: "br", showOffset: "120" },
	{ type: "br", showOffset: "130" },
	{ type: "text", start: "140", duration: "300", appendBr: false, text: "PS: ", ascii: AsciiEnum.CLEAR },
	{ type: "text", start: "440", duration: "1625", appendBr: true, text: "And believe me I am" },
	{ type: "text", start: "2065", duration: "1138", appendBr: true, text: "still alive." },
	{ type: "text", start: "4003", duration: "198", appendBr: false, text: "PPS: " },
	{ type: "text", start: "4201", duration: "1904", appendBr: true, text: "I'm doing Science and I'm" },
	{ type: "text", start: "6105", duration: "1091", appendBr: true, text: "still alive." },
	{ type: "text", start: "7996", duration: "175", appendBr: false, text: "PPPS: " },
	{ type: "text", start: "8171", duration: "1904", appendBr: true, text: "I feel FANTASTIC and I'm" },
	{ type: "text", start: "10075", duration: "1091", appendBr: true, text: "still alive." },
	{ type: "br", showOffset: "11166" },
	{ type: "text", start: "11266", duration: "1154", appendBr: true, text: "FINAL THOUGHT: " },
	{ type: "text", start: "12420", duration: "1579", appendBr: true, text: "While you're dying I'll be" },
	{ type: "text", start: "13999", duration: "1254", appendBr: true, text: "still alive." },
	{ type: "br", showOffset: "15253" },
	{ type: "text", start: "15353", duration: "829", appendBr: true, text: "FINAL THOUGHT PS: " },
	{ type: "text", start: "16182", duration: "1834", appendBr: true, text: "And when you're dead I will be" },
	{ type: "text", start: "18016", duration: "1161", appendBr: true, text: "still alive." },
	{ type: "br", showOffset: "19177" },
	{ type: "br", showOffset: "19636" },
	{ type: "text", start: "20036", duration: "1184", appendBr: true, text: "STILL ALIVE" },
];

const Section5: Lyric[] = [
	{ type: "br", showOffset: "1000" },
	{ type: "br", showOffset: "2000" },
	{ type: "br", showOffset: "3000" },
	{ type: "text", start: "4000", duration: "1500", appendBr: true, text: "  ***" },
	{ type: "text", start: "5500", duration: "1500", appendBr: true, text: "  Portal" },
	{ type: "text", start: "7000", duration: "1500", appendBr: true, text: "  'Still Alive' ending scene" },
	{ type: "text", start: "8500", duration: "1500", appendBr: true, text: "    remade with HTML, JS" },
	{ type: "text", start: "10000", duration: "1000", appendBr: true, text: "      by Gurkan" },
	{
		type: "link",
		start: "11000",
		duration: "1000",
		appendBr: true,
		text: "based on https://github.com/SDSkyKlouD/still-alive-web",
		href: "https://github.com/SDSkyKlouD/still-alive-web",
	},
	{ type: "br", showOffset: "12500" },
	{ type: "text", start: "13000", duration: "600", appendBr: true, text: " Copyright 2007- Valve Corporation." },
	{ type: "text", start: "13600", duration: "900", appendBr: true, text: "           All Rights Reserved." },
	{ type: "text", start: "14500", duration: "1500", appendBr: true, text: " Valve, Steam, Portal are trademarks" },
	{ type: "text", start: "16000", duration: "1500", appendBr: true, text: " and/or registered trademarks of" },
	{
		type: "text",
		start: "17500",
		duration: "1500",
		appendBr: true,
		text: " Valve Corporation. All other trademarks",
	},
	{
		type: "text",
		start: "19000",
		duration: "1500",
		appendBr: true,
		text: " are property of their respective owners.",
	},
	{ type: "br", showOffset: "21000" },
	{
		type: "text",
		start: "21500",
		duration: "2000",
		appendBr: true,
		text: " For the full legal info, please refer to",
	},
	{
		type: "link",
		start: "23500",
		duration: "1000",
		appendBr: true,
		text: "https://store.steampowered.com/legal",
		href: "https://store.steampowered.com/legal",
	},
	{ type: "br", showOffset: "23520" },
	{ type: "text", start: "24500", duration: "2000", appendBr: true, text: "thank you for watching <3" },
	{ type: "br", showOffset: "25000" },
	{ type: "br", showOffset: "50000" },
	{ type: "br", showOffset: "50100" },
	{ type: "br", showOffset: "50200" },
];

const Lyrics: {
	start: string;
	lyrics: Lyric[];
}[] = [
	{
		start: "0",
		lyrics: Section1,
	},
	{
		start: "53827",
		lyrics: Section2,
	},
	{
		start: "106008",
		lyrics: Section3,
	},
	{
		start: "156843",
		lyrics: Section4,
	},
	{
		start: "179250",
		lyrics: Section5,
	},
];

function renderLyric(lyric: Lyric, container: HTMLDivElement) {
	switch (lyric.type) {
		case "text": {
			const text = document.createElement("span");
			text.dataset.start = lyric.start;
			text.dataset.dur = lyric.duration;
			text.dataset.appendBr = `${lyric.appendBr}`;
			text.dataset.text = lyric.text;
			if (lyric.ascii !== undefined) {
				text.dataset.ascii = lyric.ascii;
			}
			container.appendChild(text);
			setTimeout(() => {
				if (lyric.ascii) changeAsciiArt(lyric.ascii);
				typeOneByOne(text, lyric.text, parseInt(lyric.duration), lyric.appendBr);
			}, parseInt(lyric.start));
			break;
		}
		case "br": {
			const br = document.createElement("br");
			br.dataset.showOffset = lyric.showOffset;
			container.appendChild(br);
			setTimeout(() => {
				br.style.display = "block";
				positionTerminalCursor(br);
			}, parseInt(lyric.showOffset));
			break;
		}
		case "link": {
			const link = document.createElement("a");
			link.dataset.start = lyric.start;
			link.dataset.dur = lyric.duration;
			link.dataset.appendBr = `${lyric.appendBr}`;
			link.dataset.text = lyric.text;
			link.href = lyric.href;
			container.appendChild(link);
			setTimeout(() => {
				typeOneByOne(link, lyric.text, parseInt(lyric.duration), lyric.appendBr);
			}, parseInt(lyric.start));
			break;
		}
	}
}

export { Lyrics, renderLyric };
