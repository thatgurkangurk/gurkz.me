import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import badappleVideo from "~/badapple.mp4";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { BiRegularError } from "solid-icons/bi";
import { Button } from "./ui/button";
import { createEmitter } from "@solid-primitives/event-bus";

const [videoElem, setVideoElem] = createSignal<HTMLVideoElement>();
const events = createEmitter<{
  play: HTMLVideoElement;
  pause: HTMLVideoElement;
}>();

function createTable(props: {
  table: HTMLTableElement;
  height: number;
  width: number;
}) {
  const body = document.createElement("tbody");

  for (let y = 0; y < props.height; y++) {
    let row = props.table.insertRow(y);
    row.style.width = "5px";
    row.style.height = "5px";
    for (let x = 0; x < props.width; x++) {
      let cell = row.insertCell(x);
      cell.style.width = "5px";
      cell.style.height = "5px";
    }
  }

  props.table.appendChild(body);
  return props.table;
}

function useDeviceCheck() {
  const isIOS = createSignal<boolean>(false);

  onMount(() => {
    isIOS[1](/iPad|iPhone|iPod/.test(navigator.userAgent));
  });

  return isIOS;
}

function VideoPlayer() {
  return (
    <video
      ref={setVideoElem}
      controls
      width="160"
      height="120"
      playsinline
      class="rounded-sm"
      onPlay={() => {
        events.emit("play", videoElem()!);
      }}
      onPause={() => {
        events.emit("pause", videoElem()!);
      }}
    >
      <source src={badappleVideo} type="video/mp4" />
      your browser does not support the video tag
    </video>
  );
}

const BadApple = () => {
  const [isIOS, setIsIOS] = useDeviceCheck();
  const [canvasElem, setCanvasElem] = createSignal<HTMLCanvasElement>();
  //? this is basically only used to hide the downscale factor input
  const [isDefault, setIsDefault] = createSignal<boolean>(true);
  const [tableElem, setTableElem] = createSignal<HTMLTableElement>();
  const [downscaleFactor, setDownscaleFactor] = createSignal<number>(3);

  onMount(() => {
    setCanvasElem(document.createElement("canvas"));
    setIsDefault(true);
    const video = videoElem()!;
    const table = tableElem()!;
    const canvas = canvasElem()!;

    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      alert("no context");
      return;
    }
    canvas.width = video.width;
    canvas.height = video.height;

    function fillTableCell(
      table: HTMLTableElement,
      x: number,
      y: number,
      color: string
    ) {
      table!.rows[y]!.cells[x]!.style.backgroundColor = color;
    }

    function getRGBColorFromPixel(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number
    ) {
      const { data } = ctx.getImageData(x, y, 1, 1);
      return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    }

    setTableElem(
      createTable({
        table,
        height: canvas.height / downscaleFactor(),
        width: canvas.width / downscaleFactor(),
      })
    );

    events.on("play", (video) => {
      setIsDefault(false);
      let frame = video;

      function draw() {
        try {
          context!.drawImage(frame, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          alert("cannot draw");
        }
        for (let y = 0; y < video.height; y += downscaleFactor()) {
          for (let x = 0; x < video.width; x += downscaleFactor()) {
            // the table size is already downscaled by the `downscaleFactor`
            fillTableCell(
              table,
              x / downscaleFactor(),
              y / downscaleFactor(),
              getRGBColorFromPixel(context!, x, y)
            );
          }
        }

        requestAnimationFrame(draw);
      }

      requestAnimationFrame(draw);
    });
  });

  return (
    <>
      <Switch>
        <Match when={isIOS()}>
          <Alert variant="destructive">
            <BiRegularError class="h-4 w-4" />
            <AlertTitle>error</AlertTitle>
            <AlertDescription>
              you are on iOS, and this will not work on there.
            </AlertDescription>
          </Alert>
          <Button
            variant="destructive"
            class="mt-2"
            onClick={() => setIsIOS(false)}
          >
            i don't care, let me do it anyway
          </Button>
        </Match>
        <Match when={!isIOS()}>
          <Show when={isDefault()}>
            <div class="pt-4">
              <input
                type="number"
                id="downscalefactor"
                onChange={(ev) => {
                  setDownscaleFactor(ev.target.valueAsNumber);
                }}
                placeholder="3"
                value="3"
              />
              <label for="downscalefactor"> downscale factor</label>
              <br />
              <hr />
              <br />
            </div>
          </Show>
          <VideoPlayer />
          <br />
          <table class="border-collapse rounded-sm" ref={setTableElem}></table>
        </Match>
      </Switch>
    </>
  );
};

export { BadApple };
