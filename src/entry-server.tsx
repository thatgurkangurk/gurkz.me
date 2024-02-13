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
        <body class="font-geist m-auto p-4 text-left max-w-[64ch] h-full grid gap-3 grid-cols-[1fr] grid-rows-[1fr]">
          <div id="app">
            <noscript>
              <p class="bg-red-500 rounded-md p-0.5">
                you do not have javascript enabled. some things might break.
              </p>
            </noscript>

            {children}
          </div>
          {scripts}
          <script async src="https://umami.gurkz.me/script.js" data-website-id="d6b3253f-e547-4a4f-82f4-b7424d80b446"></script>
        </body>
      </html>
    )}
  />
));
