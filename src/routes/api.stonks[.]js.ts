import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/stonks.js").methods({
  GET: async ({ request }) => {
    const res = await fetch("https://assets.onedollarstats.com/stonks.js");

    if (!res.ok) {
      return new Response("failed to fetch analytics script", { status: 500 });
    }

    const text = await res.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
});
