import { A } from "@solidjs/router";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

export default function Privacy() {
	return (
		<>
			<h1 class="text-3xl">privacy</h1>
			<p>
				this website uses cookies, and below is a list of cookies and why we use
				them
			</p>

			<Table class="w-fit pt-2">
				<TableHeader>
					<TableRow>
						<TableHead class="w-[150px]">Cookie Name</TableHead>
						<TableHead>Usage</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell class="font-medium">
							<code>kb-color-mode</code>
						</TableCell>
						<TableCell>remembers your theme setting</TableCell>
					</TableRow>
					<TableRow>
						<TableCell class="font-medium">
							<code>auth_session</code>
						</TableCell>
						<TableCell>
							(only gets set if you sign in) remembers your session
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell class="font-medium">
							<code>music_id_format</code>
						</TableCell>
						<TableCell>
							(only gets set if you go to the music id list) remembers which
							format you want the id displayed in
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<br />

			<p>
				we also use{" "}
				<A
					href="https://umami.is"
					class="hover:underline hover:underline-offset-4"
				>
					umami analytics
				</A>
				, but no personal information is collected.
			</p>

			<p>
				when you sign in,{" "}
				<A
					class="hover:underline hover:underline-offset-4"
					href="https://discord.com/privacy"
				>
					Discord's privacy policy
				</A>{" "}
				applies
			</p>
		</>
	);
}
