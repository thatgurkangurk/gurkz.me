import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedId } from "./formatted-id";
import type { MusicIdWithCreator } from "@/lib/schemas/music";

type MusicCardProps = Readonly<{ musicId: MusicIdWithCreator }>;

export function MusicCard({ musicId }: MusicCardProps) {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className="text-xl">{musicId.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-xl">
          <FormattedId robloxId={musicId.robloxId} />
        </div>

        {musicId.tags && musicId.tags.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {musicId.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-1">
        <p>
          created by <span>{musicId.creator.name}</span>
        </p>
      </CardFooter>
    </Card>
  );
}
