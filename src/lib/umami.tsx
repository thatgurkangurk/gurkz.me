import { isServer } from "solid-js/web";
import { createContext, useContext, type ParentComponent } from "solid-js";

const UmamiContext = createContext();

const UmamiProvider: ParentComponent = (props) => {
    if (isServer) return;

    return (
        <UmamiContext.Provider value={window.umami!}>
            {props.children}
        </UmamiContext.Provider>
    )
}

function useUmami() {
    return useContext(UmamiContext);
}

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

export { useUmami, trackEvent, UmamiContext, UmamiProvider }
