"use server";
import { cookies } from "next/headers";
import { IdFormat, idFormatSchema } from ".";

export async function setIdFormatAction(idFormat: IdFormat) {
  const cookieStore = await cookies();
  const defaultValue = idFormatSchema.def.defaultValue as IdFormat;

  const parsed = await idFormatSchema.safeParseAsync(idFormat);

  if (parsed.error) {
    console.error(parsed.error);
    cookieStore.set("id_format", defaultValue);
    return;
  }

  cookieStore.set("id_format", parsed.data);
}
