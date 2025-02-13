// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { Assets } from "solid-js/web";

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <meta name="format-detection" content="telephone=no" />
                    <link rel="icon" href="/favicon.ico" />
                    {assets}
                    <Assets>
                        <script defer data-domain="gurkz.me" src="https://plausible.gurkz.me/js/script.file-downloads.outbound-links.pageview-props.tagged-events.js" />
                    </Assets>
                </head>
                <body>
                    <div id="app">{children}</div>
                    {scripts}
                </body>
            </html>
        )}
    />
));
