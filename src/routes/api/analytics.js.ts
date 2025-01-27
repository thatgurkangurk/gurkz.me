export async function GET() {
    const res = await fetch("https://assets.onedollarstats.com/stonks.js");
    return await res.text();
}
