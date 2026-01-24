import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

interface Params {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const link = await prisma.trackedLink.findUnique({
      where: { slug: params.slug },
    })

    if (!link || !link.enabled) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 生成唯一的 session ID 用於追蹤後續操作
    const sessionId = `${link.id}_${Date.now()}_${randomBytes(8).toString('hex')}`

    // 記錄點擊事件
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                     request.headers.get('x-real-ip') ||
                     undefined
    const referer = request.headers.get('referer') || undefined

    // 異步記錄點擊，不阻塞重定向
    Promise.all([
      prisma.linkClick.create({
        data: {
          linkId: link.id,
          sessionId,  // 儲存 session ID
          ipAddress,
          userAgent,
          referer,
        },
      }),
      prisma.trackedLink.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      }),
    ]).catch(error => {
      console.error('Failed to track click:', error)
    })

    // 建立重定向響應並設置 tracking cookie
    const response = NextResponse.redirect(link.url, { status: 302 })

    // 設置 cookie 以追蹤使用者後續操作（有效期 24 小時）
    response.cookies.set('_track_session', sessionId, {
      httpOnly: false,  // 允許客戶端讀取
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,  // 24 小時
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
