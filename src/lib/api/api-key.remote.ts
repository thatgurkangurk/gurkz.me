import { form, getRequestEvent, query } from "$app/server";
import { authGuard } from "$lib/api/utils";
import { CreateNewApiKeySchema, DeleteApiKeySchema } from "$lib/schemas/api-key";
import { auth } from "$lib/server/auth";
import { error } from "@sveltejs/kit";

export const getApiKeys = query(async () => {
	authGuard();

	const res = await auth.api.listApiKeys({
		headers: getRequestEvent().request.headers
	});

	return res;
});

export const createApiKey = form(CreateNewApiKeySchema, async (data) => {
	const { user } = authGuard();

	const res = await auth.api.createApiKey({
		body: {
			name: data.name,
			userId: user.id,
			rateLimitEnabled: !user.admin
		}
	});

	void getApiKeys().refresh();

	return {
		success: true,
		key: res.key
	};
});

export const deleteApiKey = form(DeleteApiKeySchema, async (data) => {
	authGuard();

	const res = await auth.api.deleteApiKey({
		body: {
			keyId: data.keyId
		},
		headers: getRequestEvent().request.headers
	});

	if (!res.success) throw error(404, "couldn't find that api key");

	void getApiKeys().refresh();
});
