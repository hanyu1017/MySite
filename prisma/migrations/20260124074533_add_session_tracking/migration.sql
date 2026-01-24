-- AlterTable
ALTER TABLE "LinkClick" ADD COLUMN "sessionId" TEXT;

-- AlterTable
ALTER TABLE "Analytics" ADD COLUMN "linkClickId" TEXT;

-- Update existing LinkClick records with unique sessionId
UPDATE "LinkClick" SET "sessionId" = "id" || '-' || EXTRACT(EPOCH FROM "createdAt")::TEXT WHERE "sessionId" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LinkClick_sessionId_key" ON "LinkClick"("sessionId");

-- CreateIndex
CREATE INDEX "LinkClick_sessionId_idx" ON "LinkClick"("sessionId");

-- CreateIndex
CREATE INDEX "Analytics_linkClickId_idx" ON "Analytics"("linkClickId");

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_linkClickId_fkey" FOREIGN KEY ("linkClickId") REFERENCES "LinkClick"("id") ON DELETE SET NULL ON UPDATE CASCADE;
