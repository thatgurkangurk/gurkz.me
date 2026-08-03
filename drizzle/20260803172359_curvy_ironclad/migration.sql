CREATE TYPE "accept_type" AS ENUM('all', 'custom', 'necessary');--> statement-breakpoint
CREATE TABLE "cookie_consent" (
	"consent_id" uuid PRIMARY KEY,
	"accept_type" "accept_type" NOT NULL,
	"accepted_categories" text[] NOT NULL,
	"rejected_categories" text[] NOT NULL,
	"user_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
