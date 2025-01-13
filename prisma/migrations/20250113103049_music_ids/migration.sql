-- CreateTable
CREATE TABLE "music_id" (
    "id" VARCHAR(21) NOT NULL,
    "robloxId" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "working" BOOLEAN NOT NULL DEFAULT true,
    "creatorId" VARCHAR NOT NULL,

    CONSTRAINT "music_id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "music_id_robloxId_key" ON "music_id"("robloxId");

-- AddForeignKey
ALTER TABLE "music_id" ADD CONSTRAINT "music_id_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
