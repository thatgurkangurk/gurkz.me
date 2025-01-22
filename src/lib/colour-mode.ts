"use server";

import { getCookie } from "vinxi/http";
import { z } from "zod";

const colourModeSchema = z.enum(["dark", "light", "system"]).default("dark");

export function getColourMode() {
    const colourMode = getCookie("kb-color-mode");
    const result = colourModeSchema.safeParse(colourMode);
    return result.success
        ? `kb-color-mode=${result.data}`
        : "kb-color-mode=dark";
}
