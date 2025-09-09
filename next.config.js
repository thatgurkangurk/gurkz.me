// @ts-check
import { createJiti } from "jiti";
const jiti = createJiti(import.meta.url);

jiti.import("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typedRoutes: true,
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
