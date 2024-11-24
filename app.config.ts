import { withPRPC } from "@solid-mediakit/prpc-plugin";

const config = withPRPC(
  {
    ssr: true,
  },
  {
    auth: "authjs",
    authCfg: {
      source: "./src/lib/auth",
      configName: "authOpts",
      protectedMessage: "you need to sign in first",
    },
  }
);

declare module "@solid-mediakit/prpc" {
  interface Settings {
    config: typeof config;
  }
}

export default config;
