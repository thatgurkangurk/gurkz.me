import { A, createAsync, useLocation } from "@solidjs/router";
import { Menu } from "lucide-solid";
import { For, Show, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";
import { getAuthenticatedUser } from "~/lib/auth/utils";
import { discordLoginAction, logoutAction } from "~/lib/auth/actions";

type Link = {
	text: string;
	href: string;
	alwaysActive?: boolean;
};

type LinkProps = {
	onClick?: () => void;
} & Link;

const links: Link[] = [
	{
		href: "/",
		text: "gurkan's website",
		alwaysActive: true,
	},
	{
		href: "/",
		text: "Home",
	},
	{
		href: "/blog",
		text: "Blog",
	},
	{
		href: "/projects",
		text: "Projects",
	},
	{
		href: "/music",
		text: "Music IDs",
	},
];

function Link(props: LinkProps) {
	return (
		<A
			end={!props.alwaysActive}
			inactiveClass="text-muted-foreground hover:text-foreground"
			activeClass="text-foreground"
			class="flex items-center gap-2 font-semibold"
			onClick={props.onClick}
			href={props.href}
		>
			{props.text}
		</A>
	);
}

export function Nav() {
	const [sheetOpen, setSheetOpen] = createSignal(false);
	const user = createAsync(() => getAuthenticatedUser());
	const location = useLocation();

	return (
		<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 [grid-area:header]">
			<nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm w-full lg:gap-6">
				<For each={links}>
					{(link) => (
						<Link
							href={link.href}
							alwaysActive={link.alwaysActive}
							text={link.text}
						/>
					)}
				</For>
			</nav>
			<Sheet open={sheetOpen()} onOpenChange={(open) => setSheetOpen(open)}>
				<Button
					variant={"outline"}
					size={"icon"}
					class="shrink-0 md:hidden"
					onClick={() => setSheetOpen(true)}
				>
					<Menu class="h-5 w-5" />
					<span class="sr-only">toggle navigation menu</span>
				</Button>
				<SheetContent>
					<nav class="grid gap-6 text-lg font-medium">
						<For each={links}>
							{(link) => (
								<Link
									text={link.text}
									href={link.href}
									alwaysActive={link.alwaysActive}
									onClick={() => setSheetOpen(false)}
								/>
							)}
						</For>
					</nav>
				</SheetContent>
			</Sheet>
			<div class="ml-auto flex-1 sm:flex-initial" />
			<div class="flex flex-row items-center break-normal gap-2">
				<Show
					when={user()}
					fallback={
						<form class="w-full" action={discordLoginAction} method="post">
							<input
								type="hidden"
								id="redirect-to"
								name="redirect-to"
								value={location.pathname}
							/>
							<Button type="submit" variant="link">
								login
							</Button>
						</form>
					}
				>
					<p class="flex flex-row gap-1">
						hi, <span>{user()?.username}</span>
					</p>
					<form method="post" action={logoutAction}>
						<input
							type="hidden"
							id="redirect-to"
							name="redirect-to"
							value={location.pathname}
						/>
						<Button type="submit" variant="link">
							logout
						</Button>
					</form>
				</Show>

				<ModeToggle />
			</div>
		</header>
	);
}
