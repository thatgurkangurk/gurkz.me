import { musicRouter } from "./router/music";
import { sessionRouter } from "./router/session";

const router = {
  music: musicRouter,
  session: sessionRouter,
};

export { router };
