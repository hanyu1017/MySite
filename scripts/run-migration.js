/**
 * 執行 Session Tracking Migration
 *
 * 使用方法：
 * node scripts/run-migration.js
 */

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  // 從 .env 讀取 DATABASE_URL
  require('dotenv').config()

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ 錯誤：找不到 DATABASE_URL 環境變數')
    console.error('請確保 .env 文件中有 DATABASE_URL 設定')
    process.exit(1)
  }

  console.log('📦 連接到資料庫...')

  const client = new Client({
    connectionString: databaseUrl,
  })

  try {
    await client.connect()
    console.log('✅ 資料庫連接成功')

    // 讀取 SQL 檔案
    const sqlPath = path.join(__dirname, '..', 'prisma', 'migrations', 'apply_session_tracking.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('🔄 執行 migration...')

    // 執行 SQL
    const result = await client.query(sql)

    console.log('✅ Migration 執行成功！')

    // 顯示所有 NOTICE 訊息
    if (result.rows) {
      result.rows.forEach(row => {
        console.log(row)
      })
    }

    // 驗證變更
    console.log('\n📊 驗證資料庫變更...')

    const checkLinkClick = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'LinkClick' AND column_name = 'sessionId'
    `)

    const checkAnalytics = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Analytics' AND column_name = 'linkClickId'
    `)

    if (checkLinkClick.rows.length > 0) {
      console.log('✅ LinkClick.sessionId 欄位已存在')
    } else {
      console.log('❌ LinkClick.sessionId 欄位不存在')
    }

    if (checkAnalytics.rows.length > 0) {
      console.log('✅ Analytics.linkClickId 欄位已存在')
    } else {
      console.log('❌ Analytics.linkClickId 欄位不存在')
    }

    console.log('\n🎉 所有變更已完成！')
    console.log('\n下一步：')
    console.log('1. 重啟開發服務器：npm run dev')
    console.log('2. 測試短網址追蹤功能')
    console.log('3. 在管理後台查看完整使用者旅程')

  } catch (error) {
    console.error('❌ Migration 執行失敗：', error.message)
    console.error('\n詳細錯誤：', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// 執行 migration
runMigration()
