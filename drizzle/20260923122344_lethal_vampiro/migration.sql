CREATE TABLE "short_link" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" text NOT NULL,
	"location" text
);
