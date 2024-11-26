import { protected$ } from "@solid-mediakit/auth";

export default protected$((session$) => {
    return (
        <p>hi, {session$.user.name}. your role is {session$.user.role}</p>
    )
})