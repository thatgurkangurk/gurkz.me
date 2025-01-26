import { isServer } from "solid-js/web";

if (!isServer)
    throw new Error("this file should not be imported on the client.");
