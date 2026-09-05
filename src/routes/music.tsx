import { orpc } from "#lib/orpc.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/music")({
    component: RouteComponent,
    loader: async ({ context }) => {
        await context.queryClient.query({
            ...orpc.music.list.queryOptions(),
            staleTime: "static",
        });
    },
});

function RouteComponent() {
    const { data } = useSuspenseQuery(orpc.music.list.queryOptions());
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.map((item) => (
                <div
                    key={item.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "8px 12px",
                        borderRadius: "4px",
                    }}
                >
                    <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                    <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                        id: {item.robloxId}
                    </p>
                </div>
            ))}
        </div>
    );
}
