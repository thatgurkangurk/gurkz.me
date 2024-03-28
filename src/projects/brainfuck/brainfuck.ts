import { createSignal } from "solid-js";

function useBrainfuck() {
    const [output, setOutput] = createSignal("none");

    const interpret = (program: string) => {
        console.log(program);
        alert("test to see if this runs");
        setOutput("this interpreter is not done, this output is just a placeholder");
    }

    function reset() {
        setOutput("none");
    }

    return [output, interpret, reset];
}

export { useBrainfuck };
