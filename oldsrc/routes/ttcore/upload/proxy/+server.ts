import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	try {
		const incomingFormData = await request.formData();
		const file = incomingFormData.get("file");

		if (!file || !(file instanceof File)) {
			return Response.json({ success: false, message: "no file provided" }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const fileBlob = new File([buffer], file.name, { type: file.type || "video/mp4" });

		const outgoingFormData = new FormData();
		outgoingFormData.append("file", fileBlob, file.name);

		const userAgent = request.headers.get("user-agent") || "";
		const acceptLanguage = request.headers.get("accept-language") || "en-US,en;q=0.9";

		const response = await fetch("https://www.videotourl.com/api/upload-video", {
			method: "POST",
			headers: {
				accept: "*/*",
				"accept-language": acceptLanguage,
				origin: "https://www.videotourl.com",
				referer: "https://www.videotourl.com/",
				"user-agent": userAgent
			},
			body: outgoingFormData
		});

		const responseText = await response.text();

		if (!response.ok) {
			console.error(`upstream failure status (${response.status}):`, responseText);
			return Response.json(
				{ success: false, message: `upstream error ${response.status}`, details: responseText },
				{ status: response.status }
			);
		}

		const data = JSON.parse(responseText);
		return Response.json(data);
	} catch (error: any) {
		console.error("proxy error:", error);
		return Response.json(
			{ success: false, message: error.message || "internal proxy error" },
			{ status: 500 }
		);
	}
};
