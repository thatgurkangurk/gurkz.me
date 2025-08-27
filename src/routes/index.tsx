import { createFileRoute } from "@tanstack/react-router";
import underConstruction from "@/assets/under-construction.gif";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "home - gurkan's website",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <>
      <div className="text-2xl">hello</div>
      <img src={underConstruction} alt="a 90s under construction gif" />
    </>
  );
}
