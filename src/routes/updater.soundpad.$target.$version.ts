// copied from https://github.com/colinlienard/gitlight/blob/main/src/routes/version/%5Btarget%5D/%5Bversion%5D/%2Bserver.ts

import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

type Target = "linux" | "windows" | "darwin";

type MacosArch = "aarch64" | "x86_64" | undefined;

export type GithubUser = {
  avatar_url: string;
  display_login: string;
  login: string;
  name: string;
  url: string;
  type: "User" | "Bot";
};

export type GithubRelease = {
  author: GithubUser;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  html_url: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
  published_at: string;
};

const targetExtensions: Record<Target, string> = {
  linux: ".AppImage.tar.gz",
  windows: ".msi",
  darwin: ".app.tar.gz",
};

export const ServerRoute = createServerFileRoute(
  "/updater/soundpad/$target/$version"
).methods({
  GET: async ({ request, params }) => {
    try {
      const target = params.target as Target;
      const { version } = params;
      const arch = new URL(request.url).searchParams.get("arch") as MacosArch;

      // Get latest release from Github
      const response = await fetch(
        "https://api.github.com/repos/gurkz-oss/soundpad/releases"
      );
      const data = (await response.json()) as GithubRelease[];
      const { assets, published_at, body, tag_name } = data[0];
      const latestVersion = tag_name.split("v")[1];

      if (version === latestVersion) {
        console.log("version is latest");
        throw new Error();
      }

      let extension = targetExtensions[target];
      if (target === "darwin") {
        extension =
          arch === "aarch64" ? "aarch64.app.tar.gz" : "x64.app.tar.gz";
      }

      if (!extension) {
        console.log("no extension");
        throw new Error();
      }

      console.log(latestVersion);
      console.log(assets);

      // Get the asset and its signature file
      const updaterAsset = assets.find(({ name }) => name.endsWith(extension));
      const signatureAsset = assets.find(({ name }) =>
        name.endsWith(`${extension}.sig`)
      );

      if (!updaterAsset || !signatureAsset) {
        console.log("no updater or signature asset");
        throw new Error();
      }

      // Get the signature from the .sig file
      const signatureResponse = await fetch(
        signatureAsset.browser_download_url
      );
      const signature = await signatureResponse.text();

      const returnValue = {
        url: updaterAsset.browser_download_url,
        version: latestVersion,
        notes: body,
        pub_date: published_at,
        signature,
      };

      console.log(returnValue);

      return json(returnValue);
    } catch {
      return new Response(null, { status: 204 });
    }
  },
});
