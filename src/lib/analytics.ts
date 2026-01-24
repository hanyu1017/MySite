import { prisma } from './db'

export interface AnalyticsEvent {
  userId?: string
  event: string
  page?: string
  target?: string
  metadata?: Record<string, any>
  userAgent?: string
  ipAddress?: string
  trackingSession?: string  // 新增：追蹤 session
}

export async function trackEvent(data: AnalyticsEvent) {
  try {
    let linkClickId: string | undefined = undefined

    // 如果有 trackingSession，查找對應的 LinkClick
    if (data.trackingSession) {
      const linkClick = await prisma.linkClick.findUnique({
        where: { sessionId: data.trackingSession },
        select: { id: true },
      })

      if (linkClick) {
        linkClickId = linkClick.id
      }
    }

    await prisma.analytics.create({
      data: {
        userId: data.userId || null,
        linkClickId,  // 關聯到 LinkClick（如果有）
        event: data.event,
        page: data.page,
        target: data.target,
        metadata: data.metadata,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      },
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

export async function getAnalytics(startDate?: Date, endDate?: Date) {
  try {
    const defaultStartDate = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const defaultEndDate = endDate || new Date()

    const where = {
      createdAt: {
        gte: defaultStartDate,
        lte: defaultEndDate,
      },
    }

    const [
      totalEvents,
      pageViews,
      uniqueVisitors,
      topPages,
      topEvents,
      eventsByDay,
    ] = await Promise.all([
      // 總事件數
      prisma.analytics.count({ where }),

      // 頁面瀏覽數
      prisma.analytics.count({
        where: { ...where, event: 'page_view' },
      }),

      // 唯一訪客數（基於 IP）
      prisma.analytics.groupBy({
        by: ['ipAddress'],
        where,
        _count: true,
      }).then(results => results.filter(r => r.ipAddress !== null)),

      // 熱門頁面
      prisma.analytics.groupBy({
        by: ['page'],
        where: { ...where, event: 'page_view', page: { not: null } },
        _count: { page: true },
        orderBy: { _count: { page: 'desc' } },
        take: 10,
      }),

      // 熱門事件
      prisma.analytics.groupBy({
        by: ['event'],
        where,
        _count: { event: true },
        orderBy: { _count: { event: 'desc' } },
        take: 10,
      }),

      // 每日事件
      prisma.$queryRaw`
        SELECT
          DATE("createdAt") as date,
          COUNT(*)::int as count
        FROM "Analytics"
        WHERE "createdAt" >= ${defaultStartDate}
          AND "createdAt" <= ${defaultEndDate}
        GROUP BY DATE("createdAt")
        ORDER BY date DESC
      `,
    ])

    return {
      totalEvents,
      pageViews,
      uniqueVisitors: uniqueVisitors.length,
      topPages: topPages.map((p) => ({ page: p.page || '/', count: p._count.page })),
      topEvents: topEvents.map((e) => ({ event: e.event, count: e._count.event })),
      eventsByDay,
    }
  } catch (error) {
    console.error('Analytics query error:', error)
    // 返回空數據而不是拋出錯誤
    return {
      totalEvents: 0,
      pageViews: 0,
      uniqueVisitors: 0,
      topPages: [],
      topEvents: [],
      eventsByDay: [],
    }
  }
}
