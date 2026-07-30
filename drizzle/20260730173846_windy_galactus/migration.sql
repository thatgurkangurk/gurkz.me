ALTER TABLE "user" ALTER COLUMN "permissions" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "permissions" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "permission";--> statement-breakpoint
CREATE TYPE "permission" AS ENUM('DEFAULT', 'VIEW_MUSIC_IDS', 'CREATE_MUSIC_IDS', 'MANAGE_MUSIC_IDS');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "permissions" SET DATA TYPE "permission"[] USING "permissions"::"permission"[];--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "permissions" SET DEFAULT ARRAY['DEFAULT'::permission]::"permission"[];--> statement-breakpoint
ALTER TABLE "music_id" DROP COLUMN "verified";--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" DROP DEFAULT;