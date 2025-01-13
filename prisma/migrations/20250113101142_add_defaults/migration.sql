-- AlterTable
ALTER TABLE "user" ALTER COLUMN "permissions" SET DEFAULT ARRAY['DEFAULT']::"Permission"[],
ALTER COLUMN "role" SET DEFAULT 'USER';
