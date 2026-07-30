CREATE TABLE "music_id" (
	"id" text PRIMARY KEY NOT NULL,
	"roblox_id" text NOT NULL,
	"created_by_id" varchar NOT NULL,
	"name" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"working" boolean DEFAULT true NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "music_id" ADD CONSTRAINT "music_id_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;