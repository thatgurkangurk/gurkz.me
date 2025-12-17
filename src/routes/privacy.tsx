import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h2 className="text-2xl">privacy</h2>
      <p>hello and welcome to my website!</p>
      <p>
        we use{" "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href="https://onedollarstats.com/"
        >
          OneDollarStats analytics
        </a>{" "}
        and by using this website, you agree to{" "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href="https://onedollarstats.com/privacy"
        >
          their privacy policy.
        </a>
      </p>

      <p>
        we only collect aggregated, non-personal usage statistics like session
        length, device type, OS, browser and country. we don't collect any
        personally identifiable information from our analytics.
      </p>
      <br />
      <p>
        all data on this website is stored on Hetzner servers within the
        European Union.
      </p>
      <br />
      <p>
        if you want your data, please don't hesitate to email{" "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href="mailto:hello@gurkz.me"
        >
          hello@gurkz.me
        </a>
        {", "} and I'll get back to you as soon as possible.
      </p>

      <br />
      <p>
        when, and if you sign up, we collect your username, profile picture,
        email address and display name from the social provider you used to make
        your account. this data is never linked with analytics.
      </p>
    </>
  );
}
