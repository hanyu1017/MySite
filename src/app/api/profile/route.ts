import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/db'

// 獲取個人資料
export async function GET() {
  try {
    const profile = await prisma.profile.findFirst()

    if (!profile) {
      return NextResponse.json(
        { error: '找不到個人資料' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: '獲取個人資料失敗' },
      { status: 500 }
    )
  }
}

// 更新個人資料（僅管理員）
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // 檢查是否有現有資料
    const existingProfile = await prisma.profile.findFirst()

    let profile
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: body,
      })
    } else {
      profile = await prisma.profile.create({
        data: body,
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: '更新個人資料失敗' },
      { status: 500 }
    )
  }
}
