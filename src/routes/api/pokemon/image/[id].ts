import { type APIEvent } from "@solidjs/start/server/";

export async function GET({ params }: APIEvent) {
	if (!params.id)
		return new Response(
			JSON.stringify({
				error: "please provide a pokemon id",
			}),
			{
				status: 400,
			},
		);

	const { id } = params;

	const rawId = id.replace(".png", "");
	const mon = parseInt(rawId, 10);
	if (typeof mon !== "number") return new Response("not found", { status: 404 });

	const data = await fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mon}.png`);

	const res = new Response(data.body);

	res.headers.set("Cache-Control", "max-age=31536000, immutable");

	return res;
}
