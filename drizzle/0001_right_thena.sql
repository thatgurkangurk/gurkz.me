ALTER TABLE "music_id" ADD COLUMN "name" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "music_id" ADD COLUMN "created_at" timestamp DEFAULT now();