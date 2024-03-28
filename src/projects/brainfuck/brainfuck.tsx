import { Input } from "~/components/ui/input";
import type { JSX } from "solid-js";
import { useBrainfuck } from "./brainfuck.ts";

export function Brainfuck() {
    const { output, interpret } = useBrainfuck();
    return (
        <>
            <span>output: {output()} </span>
           <form onSubmit={(e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const program = formData.get("program").toString();
		interpret(program);
	   }}>
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
