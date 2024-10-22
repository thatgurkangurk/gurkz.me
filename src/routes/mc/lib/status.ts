import type { ServerStatus } from "./types";

async function getStatus(ip: string) {
	const req = await fetch(`https://api.mcsrvstat.us/3/${ip}`);

	const data = (await req.json()) as ServerStatus;

	return data;
}

export { getStatus };
