import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

    // 立即重定向
    return NextResponse.redirect(link.url, { status: 302 })
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
