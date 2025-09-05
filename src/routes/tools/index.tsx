import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { seo } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      ...seo({
        title: "tools - gurkan's website",
      }),
    ],
  }),
});

function RouteComponent() {
  return (
    <>
      <h1 className="text-3xl">tools</h1>
      {TOOLS.map((tool) => (
        <Card key={tool.slug}>
          <CardHeader>
            <CardTitle>{tool.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{tool.description}</CardDescription>
            <Button asChild>
              <Link to={`/tools/${tool.slug}`}>open</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
