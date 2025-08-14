import { z } from "zod/v4";

export const SocialProvider = z.enum(["discord"]);
export type SocialProvider = z.infer<typeof SocialProvider>;
