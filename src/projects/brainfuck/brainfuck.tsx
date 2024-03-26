import { createSignal } from "solid-js";
import { Input } from "~/components/ui/input";
import type { JSX } from "solid-js";

const [output, setOutput] = createSignal("none");

const handleSubmit: JSX.EventHandler<HTMLFormEvent, SubmitEvent> = (e) => {
    e.preventDefault();
    setOutput("this interpreter is not done, this output is a placeholder.");
}

export function Brainfuck() {
    return (
        <>
            <span>output: {output()} </span>
           <form onSubmit={handleSubmit}>
				<Input
                    id="program"
					placeholder="the brainfuck program to execute"
					class={`w-[90%]`}
					style={{ "font-family": "inherit" }}
					required
				/>
                <button
					class="mt-2 w-fit rounded-md bg-red-500 px-4 py-2 text-[1.2rem]"
					style={{ "font-family": "inherit" }}
				>
					run
				</button>
           </form>
        </>
    )
}
