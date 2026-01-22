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
      name: '您的名字',
      title: '全端開發者',
      bio: '這是您的個人簡介。在這裡描述您的背景、技能和熱情所在。',
      skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL'],
      education: [
        {
          school: '某某大學',
          degree: '計算機科學學士',
          year: '2018-2022',
        },
      ],
      experience: [
        {
          company: '某某公司',
          position: '軟體工程師',
          period: '2022-現在',
        },
      ],
      email: 'your@email.com',
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
    },
  })

  console.log('個人資料已創建')

  // 創建範例專案
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: '個人作品集網站',
        description: '使用 Next.js 和 PostgreSQL 建立的全端作品集網站',
        content: '這是一個完整的全端專案，包含用戶認證、專案管理和分析追蹤功能。',
        tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
        githubUrl: 'https://github.com/yourusername/portfolio',
        published: true,
        order: 1,
      },
    }),
    prisma.project.create({
      data: {
        title: '電子商務平台',
        description: '功能完整的電子商務網站',
        content: '包含產品展示、購物車、結帳流程和訂單管理系統。',
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        githubUrl: 'https://github.com/yourusername/ecommerce',
        liveUrl: 'https://example.com',
        published: true,
        order: 2,
      },
    }),
    prisma.project.create({
      data: {
        title: '即時聊天應用',
        description: '使用 WebSocket 的即時通訊應用',
        content: '支援群組聊天、私人訊息和檔案分享。',
        tags: ['Socket.io', 'Express', 'React', 'Redis'],
        githubUrl: 'https://github.com/yourusername/chat-app',
        published: true,
        order: 3,
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
