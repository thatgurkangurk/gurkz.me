import { createServerFn } from "@tanstack/react-start";
import { permix } from "./permix.js";

export const getPermixState = createServerFn().handler(({ context }) =>
    permix.dehydrate(context),
);
