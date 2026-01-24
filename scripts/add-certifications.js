/**
 * 執行 Certifications Migration
 *
 * 使用方法：
 * node scripts/add-certifications.js
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
    const sqlPath = path.join(__dirname, '..', 'prisma', 'migrations', 'add_certifications.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('🔄 執行 migration...')

    // 執行 SQL
    await client.query(sql)

    console.log('✅ Migration 執行成功！')

    // 驗證變更
    console.log('\n📊 驗證資料庫變更...')

    const checkColumn = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'Profile' AND column_name = 'certifications'
    `)

    if (checkColumn.rows.length > 0) {
      console.log('✅ Profile.certifications 欄位已存在')
      console.log('   類型:', checkColumn.rows[0].data_type)
    } else {
      console.log('❌ Profile.certifications 欄位不存在')
    }

    console.log('\n🎉 所有變更已完成！')
    console.log('\n下一步：')
    console.log('1. 重啟開發服務器：npm run dev')
    console.log('2. 在編輯頁面添加專業證照')
    console.log('3. 在首頁查看證照卡片')

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
