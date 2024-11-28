import { SolidAuth } from "@solid-mediakit/auth";
import { authOpts } from "~/lib/auth";

export const { GET, POST } = SolidAuth(authOpts);
