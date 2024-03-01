import { WebhookDestroyer as WebhookDestroyerComponent } from "~/components/webhook-destroyer";

export default function WebhookDestroyer() {
	return (
		<>
			<h1 class="pt-2 text-4xl">webhook destroyer</h1>
			<WebhookDestroyerComponent />
		</>
	);
}
