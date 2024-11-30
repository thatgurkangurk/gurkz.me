import { Cake } from "./cake";
import musicmp3 from "./music.mp3";
import styles from "./want-you-gone.module.css";
import { createSignal, onMount, Show } from "solid-js";
import { clearTimeouts } from "~/lib/timeouts";

function UI() {
    return (
        <div class={styles.ui}>
            <div class={styles.uileft}>
                <div class={styles.dotsleft}>
                    - <br /> -----
                    <br /> -----
                    <br /> -----
                    <br />
                    -- <br />- --
                    <br />- - <br />
                    ---- -<br />
                    -- ---
                    <br /> <br />- -- <br />- - <br />
                    -- ---
                    <br />
                    ------
                    <br />
                    -- -<br /> - <br />- -<br />
                    ------
                    <br />- ---
                    <br />- -<br />- --- <br /> --- <br /> - <br /> -- <br />
                    -----
                    <br />
                    ------
                    <br /> --- <br /> -<br />
                    ------
                    <br /> - --
                    <br />- -- <br /> - ---
                    <br />
                    -- -
                    <br />
                    ---- -<br />
                    ------
                    <br />
                    -- ---
                    <br /> - - <br /> - <br />- - <br /> - <br /> -
                    <br />
                    --
                    <br />- <br /> -----
                    <br /> -----
                    <br /> -----
                    <br />
                    -- <br />- --
                    <br />- - <br />
                    ---- -<br />
                    -- ---
                    <br /> <br />- -- <br />- - <br />
                    -- ---
                    <br />
                    ------
                </div>
                <div class={styles.dotsright}>
                    - <br /> -----
                    <br /> -----
                    <br /> -----
                    <br />
                    -- <br />- --
                    <br />- - <br />
                    ---- -<br />
                    -- ---
                    <br /> <br />- -- <br />- - <br />
                    -- ---
                    <br />
                    ------
                    <br />
                    -- -<br /> - <br />- -<br />
                    ------
                    <br />- ---
                    <br />- -<br />- --- <br /> --- <br /> - <br /> -- <br />
                    -----
                    <br />
                    ------
                    <br /> --- <br /> -<br />
                    ------
                    <br /> - --
                    <br />- -- <br /> - ---
                    <br />
                    -- -
                    <br />
                    ---- -<br />
                    ------
                    <br />
                    -- ---
                    <br /> - - <br /> - <br />- - <br /> - <br /> -
                    <br />
                    --
                    <br />- <br /> -----
                    <br /> -----
                    <br /> -----
                    <br />
                    -- <br />- --
                    <br />- - <br />
                    ---- -<br />
                    -- ---
                    <br /> <br />- -- <br />- - <br />
                    -- ---
                    <br />
                    ------
                </div>
            </div>
            <div class={styles.uimiddle}>
                <div>2.67</div>
                <div>1002</div>
                <div>45.6</div>
                <div>&nbsp;</div>
            </div>
            <div class={styles.uiright}>
                <svg class={styles.logo} viewBox="0 0 530 530">
                    <title>aperture science logo</title>
                    <path
                        fill="#957532"
                        d="M320.622,16.038c-48.13-10.56-96.075-6.789-139.409,8.433l205.646,142.285L363.887,29.585 C350.117,23.897,335.676,19.34,320.622,16.038z M381.61,37.721l41.565,244.095l79.798-112.224 C480.031,113.27,437.342,65.91,381.61,37.721z M164.624,30.954C107.809,55.459,60.469,100.197,33.57,158.183l248.56-46.176 L164.624,30.954z M508.526,184.605L367.76,388.57l135.075-25.795c5.425-13.334,9.788-27.293,12.978-41.823l1.161-5.589 C525.838,270.157,522.227,225.371,508.526,184.605z M165.219,149.9L26.793,174.226c-4.543,11.86-8.283,24.22-11.088,37.004 C5.067,259.717,8.992,308.02,24.5,351.609L165.219,149.9z M107.782,257.134L31.555,369.377 c24.248,54.834,67.436,100.631,123.173,127.418L107.782,257.134z M496.049,377.989l-242.225,46.989l111.375,76.992 C421.459,478.19,468.575,434.608,496.049,377.989z M146.782,370.741l23.439,132.869c12.988,5.211,26.556,9.434,40.676,12.53 c47.857,10.5,95.541,6.83,138.681-8.18L146.782,370.741z"
                    />
                </svg>
            </div>
        </div>
    );
}

export function WantYouGone() {
    const [hasStarted, setHasStarted] = createSignal<boolean>(false);

    let audio!: HTMLAudioElement;
    let lyricsDiv!: HTMLDivElement;
    let creditsDiv!: HTMLDivElement;
    let lyricsText!: HTMLDivElement;
    let creditsText!: HTMLDivElement;
    onMount(() => {
        clearTimeouts("want-you-gone");
        setHasStarted(false);
    });

    function start() {
        const cake = new Cake(
            lyricsDiv,
            creditsDiv,
            lyricsText,
            creditsText,
            audio
        );
        cake.start();
    }

    return (
        <Show
            when={hasStarted()}
            fallback={
                <button
                    type="button"
                    class="text-3xl p-3"
                    onClick={() => {
                        setHasStarted(true);
                        start();
                    }}
                >
                    click here to start
                </button>
            }
        >
            <div
                class={`${styles.wrapper} ${hasStarted() ? "" : styles.invisible}`}
            >
                <div class={styles.container}>
                    <div class={styles.lyrics} ref={lyricsDiv}>
                        <div class={styles.lyricstext} ref={lyricsText} />
                    </div>
                    <div class={styles.credits} ref={creditsDiv}>
                        <div class={styles.creditstext} ref={creditsText} />
                    </div>
                    <UI />
                </div>
                <div class={styles.buffer} />
            </div>
            <audio ref={audio}>
                <source src={musicmp3} />
            </audio>
        </Show>
    );
}
