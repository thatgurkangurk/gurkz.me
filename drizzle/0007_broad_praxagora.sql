DO $$ BEGIN
 CREATE TYPE "public"."permission" AS ENUM('DEFAULT', 'CREATE_MUSIC_IDS', 'MANAGE_MUSIC_IDS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "permissions" permission[] DEFAULT ARRAY['DEFAULT']::permission[] NOT NULL;