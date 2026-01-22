import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1, '標題為必填'),
  description: z.string().min(1, '描述為必填'),
  content: z.string().min(1, '內容為必填'),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  order: z.number().default(0),
  published: z.boolean().default(false),
})

// 獲取所有專案
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = session && session.user.role === 'ADMIN'

    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')

    const where = isAdmin
      ? published === 'true' ? { published: true } : {}
      : { published: true }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects fetch error:', error)
    return NextResponse.json(
      { error: '獲取專案失敗' },
      { status: 500 }
    )
  }
}

// 創建新專案（僅管理員）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: validatedData,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: '創建專案失敗' },
      { status: 500 }
    )
  }
}
