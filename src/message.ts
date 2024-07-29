import { cache } from "@solidjs/router";

export const getMessage = cache(async () => {
	"use server";
	return `random uuid: ${crypto.randomUUID()}`;
}, "message");
