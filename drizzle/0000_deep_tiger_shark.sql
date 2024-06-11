CREATE TABLE IF NOT EXISTS "music_id" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"roblox_id" bigint NOT NULL,
	"created_by_id" varchar(21) NOT NULL,
	"working" boolean DEFAULT true NOT NULL
);
