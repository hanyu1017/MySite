import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { trackEvent, getAnalytics } from '@/lib/analytics'

// 記錄分析事件
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const { event, page, target, metadata } = body

    if (!event) {
      return NextResponse.json(
        { error: '事件類型為必填' },
        { status: 400 }
      )
    }

    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     undefined

    await trackEvent({
      userId: session?.user ? (session.user as any).id : undefined,
      event,
      page,
      target,
      metadata,
      userAgent,
      ipAddress,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: '記錄分析失敗' },
      { status: 500 }
    )
  }
}

// 獲取分析數據（僅管理員）
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined

    const analytics = await getAnalytics(startDate, endDate)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: '獲取分析數據失敗' },
      { status: 500 }
    )
  }
}
