import * as v from "valibot";

export const SocialProvider = v.picklist(["discord"]);
export type SocialProvider = v.InferOutput<typeof SocialProvider>;
