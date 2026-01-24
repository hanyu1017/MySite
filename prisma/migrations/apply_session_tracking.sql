-- Session Tracking Migration
-- 執行此 SQL 以添加 session tracking 功能

-- 檢查 LinkClick 表是否已有 sessionId 欄位
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'LinkClick' AND column_name = 'sessionId'
    ) THEN
        -- 1. 添加 sessionId 欄位
        ALTER TABLE "LinkClick" ADD COLUMN "sessionId" TEXT;

        -- 2. 為現有記錄生成唯一的 sessionId
        UPDATE "LinkClick"
        SET "sessionId" = "id" || '-' || EXTRACT(EPOCH FROM "createdAt")::TEXT
        WHERE "sessionId" IS NULL;

        -- 3. 設置 sessionId 為 NOT NULL
        ALTER TABLE "LinkClick" ALTER COLUMN "sessionId" SET NOT NULL;

        -- 4. 添加唯一約束
        CREATE UNIQUE INDEX "LinkClick_sessionId_key" ON "LinkClick"("sessionId");

        -- 5. 添加索引
        CREATE INDEX "LinkClick_sessionId_idx" ON "LinkClick"("sessionId");

        RAISE NOTICE 'LinkClick.sessionId 欄位已添加';
    ELSE
        RAISE NOTICE 'LinkClick.sessionId 欄位已存在，跳過';
    END IF;
END $$;

-- 檢查 Analytics 表是否已有 linkClickId 欄位
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Analytics' AND column_name = 'linkClickId'
    ) THEN
        -- 6. 添加 linkClickId 欄位
        ALTER TABLE "Analytics" ADD COLUMN "linkClickId" TEXT;

        -- 7. 添加外鍵約束
        ALTER TABLE "Analytics"
        ADD CONSTRAINT "Analytics_linkClickId_fkey"
        FOREIGN KEY ("linkClickId") REFERENCES "LinkClick"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;

        -- 8. 添加索引
        CREATE INDEX "Analytics_linkClickId_idx" ON "Analytics"("linkClickId");

        RAISE NOTICE 'Analytics.linkClickId 欄位已添加';
    ELSE
        RAISE NOTICE 'Analytics.linkClickId 欄位已存在，跳過';
    END IF;
END $$;

-- 顯示完成訊息
DO $$
BEGIN
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Session Tracking Migration 完成！';
    RAISE NOTICE '===========================================';
END $$;
