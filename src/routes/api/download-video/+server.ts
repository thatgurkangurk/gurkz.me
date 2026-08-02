import { error } from "@sveltejs/kit";
import * as z from "zod/v4";

const urlSchema = z.pipe(z.string("please provide a url"), z.url("please provide a valid url"));

export async function GET({ url, locals }) {
	if (!locals.user)
		throw error(401, {
			message: "please sign in to continue"
		});

	const ALLOWED_HOSTS = new Set(["cdn.medal.tv", "medal.tv"]);

	const rawVideoUrl = url.searchParams.get("videoUrl");
	const validationResult = z.safeParse(urlSchema, rawVideoUrl);

	if (!validationResult.success) {
		const errorMessage = validationResult.error.issues[0].message;
		throw error(400, errorMessage);
	}

	const videoUrl = validationResult.data;
	const parsedTarget = new URL(videoUrl);

	if (parsedTarget.protocol !== "https:") throw error(400, "only https urls are allowed");

	if (!ALLOWED_HOSTS.has(parsedTarget.hostname) && !parsedTarget.hostname.endsWith(".medal.tv"))
		throw error(400, "this host is not allowed");

	try {
		const videoRes = await fetch(videoUrl);

		if (!videoRes.ok) {
			console.log(videoRes.statusText);
			throw error(videoRes.status, "failed to fetch the actual video file");
		}

		const headers = new Headers(videoRes.headers);
		headers.set("Content-Disposition", 'attachment; filename="medal-clip.mp4"');

		return new Response(videoRes.body, {
			status: 200,
			headers: headers
		});
	} catch (err) {
		console.error("clip proxy error:", err);
		throw error(500, "failed to download the clip");
	}
}
