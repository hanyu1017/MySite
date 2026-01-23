import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleLinks = [
  { slug: 'github', url: 'https://github.com', title: 'GitHub', description: '全球最大的代碼托管平台' },
  { slug: 'linkedin', url: 'https://linkedin.com', title: 'LinkedIn', description: '專業人脈社交平台' },
  { slug: 'portfolio', url: 'https://example.com/portfolio', title: '作品集', description: '個人作品集網站' },
  { slug: 'blog', url: 'https://example.com/blog', title: '技術博客', description: '個人技術博客' },
  { slug: 'resume', url: 'https://example.com/resume.pdf', title: '履歷下載', description: 'PDF格式履歷' },
  { slug: 'youtube', url: 'https://youtube.com/@username', title: 'YouTube頻道', description: '影片教學頻道' },
  { slug: 'twitter', url: 'https://twitter.com/username', title: 'Twitter', description: '社交媒體帳號' },
  { slug: 'medium', url: 'https://medium.com/@username', title: 'Medium', description: '技術文章平台' },
  { slug: 'devto', url: 'https://dev.to/username', title: 'Dev.to', description: '開發者社群' },
  { slug: 'discord', url: 'https://discord.gg/invite', title: 'Discord社群', description: '技術交流Discord' },
  { slug: 'telegram', url: 'https://t.me/channel', title: 'Telegram頻道', description: '即時通訊頻道' },
  { slug: 'newsletter', url: 'https://example.com/newsletter', title: '電子報訂閱', description: '每週技術電子報' },
  { slug: 'courses', url: 'https://example.com/courses', title: '線上課程', description: '程式設計課程' },
  { slug: 'ebook', url: 'https://example.com/ebook', title: '電子書下載', description: '免費技術電子書' },
  { slug: 'tools', url: 'https://example.com/tools', title: '開發工具', description: '推薦開發工具清單' },
  { slug: 'templates', url: 'https://example.com/templates', title: '專案模板', description: '開源專案模板' },
  { slug: 'resources', url: 'https://example.com/resources', title: '學習資源', description: '精選學習資源' },
  { slug: 'community', url: 'https://example.com/community', title: '技術社群', description: '加入技術社群' },
  { slug: 'event', url: 'https://example.com/event', title: '技術活動', description: '即將舉辦的活動' },
  { slug: 'webinar', url: 'https://example.com/webinar', title: '線上研討會', description: '免費線上講座' },
  { slug: 'podcast', url: 'https://example.com/podcast', title: 'Podcast', description: '技術播客節目' },
  { slug: 'slides', url: 'https://example.com/slides', title: '簡報分享', description: '演講簡報下載' },
  { slug: 'demo', url: 'https://example.com/demo', title: '專案示範', description: '互動式專案展示' },
  { slug: 'docs', url: 'https://example.com/docs', title: '技術文件', description: '詳細技術文件' },
  { slug: 'api', url: 'https://example.com/api', title: 'API文件', description: 'API使用說明' },
  { slug: 'sandbox', url: 'https://codesandbox.io/s/example', title: 'Code Sandbox', description: '線上程式編輯器' },
  { slug: 'codepen', url: 'https://codepen.io/username', title: 'CodePen', description: '前端作品展示' },
  { slug: 'figma', url: 'https://figma.com/@username', title: 'Figma設計', description: 'UI/UX設計作品' },
  { slug: 'dribbble', url: 'https://dribbble.com/username', title: 'Dribbble', description: '設計作品集' },
  { slug: 'behance', url: 'https://behance.net/username', title: 'Behance', description: '創意作品展示' },
]

async function main() {
  console.log('開始創建追蹤連結...')

  for (const link of sampleLinks) {
    const existing = await prisma.trackedLink.findUnique({
      where: { slug: link.slug }
    })

    if (!existing) {
      await prisma.trackedLink.create({
        data: link
      })
      console.log(`✓ 創建連結: ${link.slug}`)
    } else {
      console.log(`○ 連結已存在: ${link.slug}`)
    }
  }

  console.log('完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
