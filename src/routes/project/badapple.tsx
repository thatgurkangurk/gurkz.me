import badappleVideo from "~/badapple.mp4";

export default function BadApple() {
    return (
        <>
            <h1 class="text-4xl pt-2">bad apple in HTML</h1>
            <video controls width="160" height="120" playsinline>
                <source src={badappleVideo} type="video/mp4" />
            </video>
        </>
    )
}
