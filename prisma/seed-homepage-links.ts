import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 生成隨機字符串（8位亂碼）
function generateRandomSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 生成30個唯一的隨機 slug
function generateUniqueSlugs(count: number): string[] {
  const slugs = new Set<string>()
  while (slugs.size < count) {
    slugs.add(generateRandomSlug())
  }
  return Array.from(slugs)
}

// 生成30個導向首頁的追蹤連結
const slugs = generateUniqueSlugs(30)
const homepageLinks = slugs.map((slug, index) => ({
  slug,
  url: '/',
  title: `追蹤連結 ${index + 1}`,
  description: `可用於追蹤的首頁連結 #${index + 1}`,
  notes: `未分配 - 請在管理後台編輯此欄位記錄使用者資訊`,
}))

async function main() {
  console.log('開始創建30個導向首頁的追蹤連結...')
  console.log('生成的隨機 slug：\n')

  for (const link of homepageLinks) {
    const existing = await prisma.trackedLink.findUnique({
      where: { slug: link.slug }
    })

    if (!existing) {
      await prisma.trackedLink.create({
        data: link
      })
      console.log(`✓ 創建連結: /l/${link.slug}`)
    } else {
      await prisma.trackedLink.update({
        where: { slug: link.slug },
        data: {
          url: link.url,
          title: link.title,
          description: link.description,
          notes: link.notes,
        }
      })
      console.log(`↻ 更新連結: /l/${link.slug}`)
    }
  }

  console.log('\n✅ 完成！已創建/更新 30 個追蹤連結')
  console.log('\n📝 使用說明：')
  console.log('1. 所有連結都導向首頁 (/)')
  console.log('2. 每個連結都有唯一的8位隨機亂碼')
  console.log('3. 請在管理後台編輯「備註」欄位，記錄連結給了誰')
  console.log('4. 在分析頁面可以查看每個連結的點擊數據')
  console.log(`\n範例連結: http://你的網域/l/${homepageLinks[0].slug}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
