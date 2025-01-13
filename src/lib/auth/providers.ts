import { z } from "zod";

const socialProvidersSchema = z.enum([
    "github",
    "apple",
    "discord",
    "facebook",
    "microsoft",
    "google",
    "spotify",
    "twitch",
    "twitter",
    "dropbox",
    "linkedin",
    "gitlab",
    "reddit",
]);

export { socialProvidersSchema };
