CREATE TABLE "clip" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_by_id" text NOT NULL,
	"video_id" text NOT NULL,
	"url" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"selected" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"overridden_profile_data_id" uuid,
	"songs" text[] DEFAULT '{}'::text[] NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"line1" text NOT NULL,
	"line2" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL UNIQUE,
	"submissions_open" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"message" text,
	"message_updated_at" timestamp,
	CONSTRAINT "linked_message_check" CHECK (("message" IS NULL AND "message_updated_at" IS NULL) OR ("message" IS NOT NULL AND "message_updated_at" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "clip" ADD CONSTRAINT "clip_overridden_profile_data_id_profile_id_fkey" FOREIGN KEY ("overridden_profile_data_id") REFERENCES "profile"("id");