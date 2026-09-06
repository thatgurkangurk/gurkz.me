import { MedalDownloaderSchema } from "#lib/schemas/medal-downloader.js";

import * as env from "$app/env/private";
import { form } from "$app/server";
import { invalid, redirect } from "@sveltejs/kit";

import { authGuard } from "./utils";

export const medalDownloader = form(MedalDownloaderSchema, async (data, issues) => {
	authGuard();

	const targetUrl = new URL("/api/clip", env.DOWNLOAD_URL);

	const apiRes = await fetch(targetUrl, {
		body: JSON.stringify({ url: data.url }),
		headers: { "Content-Type": "application/json" },
		method: "POST"
	});

	if (!apiRes.ok) {
		console.log(`api res: ${apiRes.statusText}`);
		invalid(issues.url("failed to fetch clip metadata"));
	}

	const json = await apiRes.json();

	if (!json.src) {
		invalid(issues.url("failed to get a valid video source link"));
	}

	redirect(303, `/api/download-video?videoUrl=${encodeURIComponent(json.src)}`);
});
