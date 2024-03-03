import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="en" class="ml-[calc(100vw-100%)] mr-0 h-[96dvh] touch-manipulation scroll-smooth antialiased">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="icon" href="/favicon.ico" />
					{assets}
				</head>
				<body
					id="app"
					class="m-auto grid h-screen max-w-[64ch] grid-cols-[1fr] grid-rows-[1fr] gap-3 p-4 text-left font-geist"
				>
					<noscript>
						<p class="rounded-md bg-red-500 p-0.5">
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
