CREATE TYPE "public"."permission" AS ENUM('DEFAULT', 'CREATE_MUSIC_IDS', 'MANAGE_MUSIC_IDS', 'CREATE_SHORT_LINKS');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "music_id" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"roblox_id" text NOT NULL,
	"created_by_id" varchar NOT NULL,
	"name" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"working" boolean DEFAULT true NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "short_link" (
	"id" varchar(48) PRIMARY KEY NOT NULL,
	"slug" varchar(32),
	"redirect_to" text,
	"creator_id" varchar NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "short_link_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"permissions" "permission"[] DEFAULT ARRAY['DEFAULT']::permission[] NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "music_id" ADD CONSTRAINT "music_id_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "short_link" ADD CONSTRAINT "short_link_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE cascade;