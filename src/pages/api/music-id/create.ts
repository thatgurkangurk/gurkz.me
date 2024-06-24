import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { musicIds } from "@/lib/schema/music";
import type { APIContext } from "astro";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  robloxId: zfd.numeric(z.number()),
  name: zfd.text(z.string().min(8).max(128)),
});

export async function POST({ request, locals }: APIContext) {
  if (!locals.user)
    return new Response(
      JSON.stringify({
        message: "unauthorised",
      }),
      {
        status: 403,
      }
    );

  if (!hasPermission("CREATE_MUSIC_IDS", locals.user))
    return new Response(
      JSON.stringify({
        message: "unauthorised",
      }),
      {
        status: 403,
      }
    );

  const data = await request.formData();

  const parseResult = schema.safeParse(data);

  if (parseResult.error) {
    return new Response(
      JSON.stringify({
        errors: parseResult.error.errors,
      })
    );
  }

  const { name, robloxId } = parseResult.data;

  await db.insert(musicIds).values({
    name: name,
    robloxId: robloxId,
    createdById: locals.user.id,
  });

  return new Response(null, {
    status: 200,
  });
}
