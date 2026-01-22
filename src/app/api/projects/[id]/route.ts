import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/db'

interface Params {
  params: {
    id: string
  }
}

// 獲取單個專案
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        { error: '找不到此專案' },
        { status: 404 }
      )
    }

    const session = await getServerSession(authOptions)
    const isAdmin = session && (session.user as any).role === 'ADMIN'

    if (!project.published && !isAdmin) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json(
      { error: '獲取專案失敗' },
      { status: 500 }
    )
  }
}

// 更新專案（僅管理員）
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const project = await prisma.project.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Project update error:', error)
    return NextResponse.json(
      { error: '更新專案失敗' },
      { status: 500 }
    )
  }
}

// 刪除專案（僅管理員）
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Project delete error:', error)
    return NextResponse.json(
      { error: '刪除專案失敗' },
      { status: 500 }
    )
  }
}
