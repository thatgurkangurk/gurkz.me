<script lang="ts">
	import { authClient } from "$lib/auth";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
		DropdownMenuGroup,
		DropdownMenuItem
	} from "$lib/components/ui/dropdown-menu/index.js";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import { CircleUserRound, LogOut, UserIcon } from "@lucide/svelte";
	import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
	import { buttonVariants } from "./ui/button";
	import { useSession } from "$lib/session.svelte";

	const session = useSession();
</script>

{#if session.current}
	<DropdownMenu>
		<DropdownMenuTrigger>
			<Avatar class="size-8 rounded-full">
				<AvatarImage src={session.current.user.image}></AvatarImage>
				<AvatarFallback>
					<Skeleton class="size-8 rounded-full" />
				</AvatarFallback>
			</Avatar>
		</DropdownMenuTrigger>
		<DropdownMenuContent class="min-w-56 rounded-lg">
			<DropdownMenuLabel class="p-0 font-normal">
				<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
					<Avatar class="size-8 rounded-full">
						<AvatarImage src={session.current.user.image} alt={session.current.user.name} />
						<AvatarFallback class="rounded-lg">
							<Skeleton class="size-8 rounded-full" />
						</AvatarFallback>
					</Avatar>
					<span class="truncate font-bold">{session.current.user.name}</span>
				</div>
			</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem onclick={async () => await authClient.signOut()}>
					<LogOut /> log out
				</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
{:else}
	<DropdownMenu>
		<DropdownMenuTrigger
			class={buttonVariants({
				size: "icon",
				variant: "secondary",
				class: "size-8 rounded-full text-black dark:text-white"
			})}
		>
			<UserIcon />
		</DropdownMenuTrigger>
		<DropdownMenuContent class="min-w-56 rounded-lg">
			<DropdownMenuLabel class="p-0 font-normal">
				<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
					<UserIcon />
					<div class="grid flex-1 text-start text-sm leading-tight">
						<span class="truncate font-bold">welcome!</span>
						<span class="truncate text-xs opacity-70"> please sign in </span>
					</div>
				</div>
			</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem
					onclick={async () =>
						await authClient.signIn.social({
							provider: "discord"
						})}
				>
					<LogOut /> log in
				</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
{/if}
