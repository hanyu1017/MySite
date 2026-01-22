import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('=== 創建管理員帳號 ===\n')

  const email = await question('電子郵件: ')
  const password = await question('密碼: ')
  const name = await question('名字 (可選): ')

  if (!email || !password) {
    console.error('錯誤: 電子郵件和密碼為必填')
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || undefined,
      role: 'ADMIN',
    },
  })

  console.log('\n✓ 管理員帳號已創建！')
  console.log('Email:', user.email)
  console.log('名字:', user.name || '(未設置)')
}

main()
  .catch((e) => {
    console.error('錯誤:', e)
    process.exit(1)
  })
  .finally(async () => {
    rl.close()
    await prisma.$disconnect()
  })
