DROP TABLE "oauth_account";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "discord_id" integer;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_discord_id_unique" UNIQUE("discord_id");