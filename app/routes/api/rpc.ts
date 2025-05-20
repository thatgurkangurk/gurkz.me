import { createAPIFileRoute } from "@tanstack/solid-start/api";
import { APIRoute as BaseAPIRoute } from "./rpc.$";

export const APIRoute = createAPIFileRoute("/api/rpc")(BaseAPIRoute.methods);
