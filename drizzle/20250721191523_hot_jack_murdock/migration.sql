CREATE TYPE "public"."permission" AS ENUM('DEFAULT', 'CREATE_MUSIC_IDS', 'CREATE_AUTO_VERIFIED_MUSIC_IDS', 'MANAGE_MUSIC_IDS');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "permissions" "permission"[] DEFAULT ARRAY['DEFAULT']::permission[] NOT NULL;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "impersonated_by";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "banned";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_reason";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "ban_expires";