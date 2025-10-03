import { browser } from "$app/environment";
import { orpc } from "$lib/orpc";
import { serializer } from "$lib/serialiser";
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/svelte-query";

export async function load() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				queryKeyHashFn(queryKey) {
					const [json, meta] = serializer.serialize(queryKey);
					return JSON.stringify({ json, meta });
				}
			},
			dehydrate: {
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) || query.state.status === "pending",
				serializeData(data) {
					const [json, meta] = serializer.serialize(data);
					return { json, meta };
				}
			},
			hydrate: {
				deserializeData(data) {
					return serializer.deserialize(data.json, data.meta);
				}
			}
		}
	});

	await queryClient.ensureQueryData(orpc.session.get.queryOptions());

	return { queryClient };
}
