import { actions } from "astro:actions";
import { Button } from "~/components/ui/button";
import type { SocialProvider } from "~/lib/auth/providers";
import { properCase } from "~/lib/utils";

export function SocialSignIn(props: { provider: SocialProvider }) {
    return (
        <>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const { data, error } = await actions.auth.signInSocial(
                        new FormData(e.currentTarget)
                    );

                    if (!error) {
                        window.location.href = data.url!;
                    }
                }}
                method="post"
                action={actions.auth.signInSocial}
            >
                <input type="hidden" name="provider" value={props.provider} />
                <Button type="submit">
                    sign in with {properCase(props.provider)}
                </Button>
            </form>
        </>
    );
}
