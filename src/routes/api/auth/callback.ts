import { json, redirect } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { setTokens } from "~/lib/auth/tokens";
import { client } from "~/lib/auth/client";

export async function GET({ request }: APIEvent) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	const exchanged = await client.exchange(code!, `${url.origin}/api/auth/callback`);

	if (exchanged.err) return json(exchanged.err, { status: 400 });

	await setTokens(exchanged.tokens.access, exchanged.tokens.refresh);

	return redirect(`${url.origin}/`);
}
