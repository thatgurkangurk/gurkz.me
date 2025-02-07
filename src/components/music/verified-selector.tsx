import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { setVerifiedOnly, verifiedOnly } from "~/lib/music/verified-only";

export function VerifiedSelector() {
    return (
        <div class="pb-2">
            <Card class="w-fit">
                <CardHeader class="flex flex-row gap-2 justify-items-center">
                    <Checkbox
                        checked={verifiedOnly()}
                        onChange={(checked) => setVerifiedOnly(checked)}
                    />
                    <CardTitle>only show verified music ids?</CardTitle>
                </CardHeader>
                <CardFooter>
                    <p class="text-sm text-muted-foreground">
                        this is recommended, as unverified music ids can be
                        added by anyone, and their quality is not guaranteed
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
