import { getOrGenerateClipThumbnail } from "#lib/server/clips/thumbnail.js";

import { error } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
	const clipId = params.id;

	if (!clipId) {
		throw error(400, "Missing clip ID");
	}

	const result = await getOrGenerateClipThumbnail(clipId);

	if (result.isErr()) {
		console.error("Thumbnail generation error:", result.error);

		if (result.error.message.includes("not found")) {
			throw error(404, "Clip not found");
		}

		throw error(500, "Failed to generate thumbnail");
	}

	const imageBuffer = result.value;

	return new Response(new Uint8Array(imageBuffer), {
		headers: {
			"Content-Type": "image/webp",
			"Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
			"Access-Control-Allow-Origin": "*",
			"Content-Length": imageBuffer.length.toString()
		}
	});
};
