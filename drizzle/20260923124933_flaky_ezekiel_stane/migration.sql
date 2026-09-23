ALTER TABLE "short_link" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "short_link" ADD CONSTRAINT "short_link_slug_key" UNIQUE("slug");