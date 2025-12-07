import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { authClient } from "~/lib/auth";

export function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<AuthQueryProvider>
			<AuthUIProviderTanstack
				changeEmail={false}
				signUp={false}
				credentials={false}
				deleteUser={false}
				authClient={authClient}
				social={{
					providers: ["discord", "github"],
				}}
				localization={{
					SECURITY: "security",

					PROVIDERS: "providers",
					PROVIDERS_DESCRIPTION: "connect your account to third-party services",
					UNLINK: "unlink",
					LINK: "link",

					SESSIONS: "sessions",
					SESSIONS_DESCRIPTION: "manage your active sessions and revoke access",
					REVOKE: "revoke",

					SIGN_OUT: "log out",
					SIGN_IN: "log in",

					SETTINGS: "account settings",

					ACCOUNT: "account",
					NAME: "display name",
					NAME_DESCRIPTION: "please don't enter your full name",
					NAME_INSTRUCTIONS: "please only use a maximum of 32 characters",
				}}
				navigate={(href) => router.navigate({ href })}
				replace={(href) => router.navigate({ href, replace: true })}
				Link={({ href, ...props }) => <Link to={href} {...props} />}
			>
				{children}
			</AuthUIProviderTanstack>
		</AuthQueryProvider>
	);
}
