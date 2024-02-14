import { isServer } from "solid-js/web";

function trackEvent(ev: string) {
    if (isServer) return;

    if (window.umami) {
        window.umami.track(ev);
        return;
    } else {
        console.warn("analytics script does not exist");
        return;
    }
}

export { trackEvent }