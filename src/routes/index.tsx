import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: Home,
});

function Home() {
    return (
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            hello there 👀
        </h1>
    );
}
