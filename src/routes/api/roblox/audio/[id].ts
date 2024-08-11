import type { APIEvent } from "@solidjs/start/server";

export async function GET({ params }: APIEvent) {
	const id = params.id;

	if (!Number.parseInt(id))
		return new Response(
			JSON.stringify({
				message: "please provide a number as the id",
			}),
			{
				status: 400,
			},
		);

	const res = await fetch(`https://api.hyra.io/audio/${id}`);

	console.log(res);

	if (res.status === 200)
		return new Response(await res.blob(), {
			headers: {
				"Cache-Control": "max-age=604800",
			},
		});

	return new Response(JSON.stringify(await res.json()), {
		status: res.status,
	});
}
