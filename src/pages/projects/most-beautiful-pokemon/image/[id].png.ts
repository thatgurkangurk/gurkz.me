export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;
  const mon = parseInt(id, 10);
  if (typeof mon !== "number")
      return new Response("Not found", { status: 404 });

  const response = await fetch(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${mon}.png`
  );

  const buffer = Buffer.from(response.arrayBuffer);

  const newRes = new Response(buffer, {
    headers: { "Content-Type": "image/png", "Cache-Control": "max-age=31536000, immutable" }
  });

  return newRes;
}