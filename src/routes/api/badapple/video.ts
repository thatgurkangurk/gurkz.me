import type { APIEvent } from "@solidjs/start/server";
import { join } from "node:path";
import { statSync, createReadStream } from "node:fs";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const videoPath = join(__dirname, "..", "..", "..", "badapple.mp4");

export async function GET({ request }: APIEvent) {
  const stat = statSync(videoPath);
  const fileSize = stat.size
  const range = request.headers.range
  const response = new Response();
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1;
    const chunksize = (end-start)+1;
    const file = createReadStream(videoPath, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    response.writeHead(206, head);
    file.pipe(response);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    response.writeHead(200, head)
    fs.createReadStream(videoPath).pipe(response);
  }
  return response;
}
