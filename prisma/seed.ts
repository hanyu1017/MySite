import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('開始種子數據...')

  // 創建管理員用戶
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      name: '管理員',
      role: 'ADMIN',
    },
  })

  console.log('管理員用戶已創建:', admin.email)

  // 創建個人資料
  const profile = await prisma.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: '黃瀚宇',
      title: '系統開發工程師 / 資訊管理碩士',
      bio: '擁有統計學背景與資訊管理碩士學位（2026 年 1 月畢業），致力於結合 IT 專業技術與對航空或金融產業的熱情。擅長運用數據分析思維解決複雜問題，並具備全端開發能力。在開發過程中，特別重視使用者體驗 (UX)，並以細心、堅持和創新的態度面對挑戰。',
      skills: [
        'Python',
        'Java',
        'TypeScript',
        'SQL',
        'Node.js',
        'Prisma ORM',
        'Next.js',
        'PostgreSQL',
        'Git',
        'AI 輔助開發工具 (Claude Code, Gemini-CLI)'
      ],
      education: [
        {
          school: '輔仁大學 (Fu Jen Catholic University)',
          degree: '資訊管理碩士 (Master of Information Management)',
          year: '預計 2026 年 1 月畢業',
          description: '碩士論文：綠色供應鏈智慧庫存管理系統'
        },
        {
          school: '輔仁大學 (Fu Jen Catholic University)',
          degree: '統計資訊學系學士 (Bachelor of Statistics and Information Science)',
          year: '2018-2022',
          description: ''
        },
      ],
      experience: [
        {
          company: '數據分析公司',
          position: '系統開發工程師實習生 (System Development Engineer Intern)',
          period: '2023 年 1 月 – 2023 年 12 月',
          description: '參與半導體產業的先進規劃排程系統 (APS) 開發。協助優化系統效能與功能實作，累積實務開發經驗。'
        },
      ],
      email: adminEmail,
      github: 'https://github.com/hanyu1017',
      linkedin: '',
      twitter: '',
    },
  })

  console.log('個人資料已創建')

  // 創建專案
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: '綠色供應鏈智慧庫存管理系統 (碩士論文)',
        description: '結合數學最佳化模型與 AI 輔助的全端 Web 應用程式',
        content: `開發一套結合數學最佳化模型與 AI 輔助的全端 Web 應用程式，旨在解決供應鏈中的庫存管理與環保平衡問題。

**技術亮點：**
- 建置全端架構，整合前後端功能
- 導入數學模型進行最佳化運算
- 整合 AI 驅動的聊天機器人 (Chatbot) 以提升使用者互動效率

**專案成果：**
此系統成功幫助企業在降低庫存成本的同時，也實現了環境友善的供應鏈管理目標。`,
        tags: ['Next.js', 'Python', 'AI', 'PostgreSQL', 'Optimization', 'Chatbot'],
        githubUrl: 'https://github.com/hanyu1017/green-supply-chain',
        published: true,
        order: 1,
      },
    }),
    prisma.project.create({
      data: {
        title: '個人作品集網站',
        description: '使用 Next.js 和 PostgreSQL 建立的全端作品集網站',
        content: `這是一個功能完整的全端個人作品集網站，展示了我的專業技能與項目經驗。

**主要功能：**
- 認證系統：NextAuth.js 實現的安全登入機制
- 專案管理：CRUD 操作管理專案作品
- 分析追蹤：自建的用戶行為分析系統
- 響應式設計：完美適配手機和電腦
- 瀑布式首頁：流暢的滾動體驗

**技術棧：**
前端採用 Next.js 14 (App Router)、TypeScript、Tailwind CSS，後端使用 Next.js API Routes，資料庫選用 PostgreSQL with Prisma ORM，並部署在 Railway 平台上。`,
        tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'NextAuth', 'Prisma'],
        githubUrl: 'https://github.com/hanyu1017/MySite',
        published: true,
        order: 2,
      },
    }),
  ])

  console.log(`已創建 ${projects.length} 個範例專案`)
  console.log('種子數據完成！')
}

main()
  .catch((e) => {
    console.error('種子數據錯誤:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
