import { Analytics } from "@gurkz/solid-analytics";
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html
        lang="en"
        class="ml-[calc(100vw-100%)] mr-0 h-[96dvh] antialiased touch-manipulation scroll-smooth"
      >
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body
          id="app"
          class="font-geist m-auto p-4 text-left max-w-[64ch] h-screen grid gap-3 grid-cols-[1fr] grid-rows-[1fr]"
        >
          <noscript>
            <p class="bg-red-500 rounded-md p-0.5">
              you do not have javascript enabled. some things might break.
            </p>
          </noscript>
          {children}
          {scripts}
        </body>
      </html>
    )}
  />
));
