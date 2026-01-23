import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const linkSchema = z.object({
  slug: z.string().min(1, 'Slug為必填').regex(/^[a-zA-Z0-9_-]+$/, 'Slug只能包含字母、數字、底線和破折號'),
  url: z.string().url('請輸入有效的網址'),
  title: z.string().min(1, '標題為必填'),
  description: z.string().optional(),
  notes: z.string().optional(),
  enabled: z.boolean().default(true),
})

// 獲取所有追蹤連結
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const links = await prisma.trackedLink.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { clickEvents: true }
        }
      }
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Links fetch error:', error)
    return NextResponse.json(
      { error: '獲取連結失敗' },
      { status: 500 }
    )
  }
}

// 創建新追蹤連結
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
    const validatedData = linkSchema.parse(body)

    // 檢查slug是否已存在
    const existing = await prisma.trackedLink.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: '此Slug已被使用' },
        { status: 400 }
      )
    }

    const link = await prisma.trackedLink.create({
      data: validatedData,
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Link creation error:', error)
    return NextResponse.json(
      { error: '創建連結失敗' },
      { status: 500 }
    )
  }
}
