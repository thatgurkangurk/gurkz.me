import { User } from "@solid-mediakit/auth";
import { A } from "@solidjs/router";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
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
            <CardContent>
                <Button as={A} href={`/admin/user/${props.user.id}`}>
                    edit
                </Button>
            </CardContent>
            <CardFooter>
                <CardDescription>user id: {props.user.id}</CardDescription>
            </CardFooter>
        </Card>
    );
}
