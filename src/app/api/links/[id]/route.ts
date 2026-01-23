import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

interface Params {
  params: {
    id: string
  }
}

// 獲取單個追蹤連結（包含詳細統計）
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const link = await prisma.trackedLink.findUnique({
      where: { id: params.id },
      include: {
        clickEvents: {
          orderBy: { createdAt: 'desc' },
          take: 100,
        },
        _count: {
          select: { clickEvents: true }
        }
      }
    })

    if (!link) {
      return NextResponse.json(
        { error: '找不到此連結' },
        { status: 404 }
      )
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error('Link fetch error:', error)
    return NextResponse.json(
      { error: '獲取連結失敗' },
      { status: 500 }
    )
  }
}

// 更新追蹤連結
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // 如果更新slug，檢查是否已存在
    if (body.slug) {
      const existing = await prisma.trackedLink.findFirst({
        where: {
          slug: body.slug,
          NOT: { id: params.id }
        }
      })

      if (existing) {
        return NextResponse.json(
          { error: '此Slug已被使用' },
          { status: 400 }
        )
      }
    }

    const link = await prisma.trackedLink.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Link update error:', error)
    return NextResponse.json(
      { error: '更新連結失敗' },
      { status: 500 }
    )
  }
}

// 刪除追蹤連結
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    await prisma.trackedLink.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Link delete error:', error)
    return NextResponse.json(
      { error: '刪除連結失敗' },
      { status: 500 }
    )
  }
}
