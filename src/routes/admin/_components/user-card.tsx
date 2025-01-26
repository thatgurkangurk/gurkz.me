import { User } from "@solid-mediakit/auth";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

export function UserCard(props: { user: User }) {
    return (
        <Card class="w-full max-w-xs">
            <CardHeader>
                <CardTitle>{props.user.name}</CardTitle>
                <CardDescription>{props.user.email}</CardDescription>
            </CardHeader>
            <CardFooter>
                <CardDescription>user id: {props.user.id}</CardDescription>
            </CardFooter>
        </Card>
    );
}
