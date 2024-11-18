CREATE TABLE IF NOT EXISTS "music_id" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"roblox_id" bigint NOT NULL,
	"created_by_id" varchar(21) NOT NULL,
	"name" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"working" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "music_id" ADD CONSTRAINT "music_id_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
