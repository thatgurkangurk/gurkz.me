import { Button } from "~/lib/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/lib/components/ui/card";
import type { User } from "~/lib/user";

export function UserCard(props: { user: User }) {
    return (
        <Card class="w-full max-w-xs">
            <CardHeader>
                <CardTitle>{props.user.name}</CardTitle>
                <CardDescription>{props.user.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button as="a" href={`/admin/user/${props.user.id}`}>
                    edit
                </Button>
            </CardContent>
            <CardFooter>
                <CardDescription>user id: {props.user.id}</CardDescription>
            </CardFooter>
        </Card>
    );
}
