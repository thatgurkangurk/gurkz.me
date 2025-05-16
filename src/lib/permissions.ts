import { type } from "arktype";

export const options = [
  "DEFAULT",
  "CREATE_MUSIC_IDS",
  "MANAGE_MUSIC_IDS",
  "CREATE_SHORT_LINKS",
] as const;

export const Permissions = type("===", options);

export type Permission = type.infer<typeof Permissions>;
