import { prisma } from './db'

export interface AnalyticsEvent {
  userId?: string
  event: string
  page?: string
  target?: string
  metadata?: Record<string, any>
  userAgent?: string
  ipAddress?: string
}

export async function trackEvent(data: AnalyticsEvent) {
  try {
    await prisma.analytics.create({
      data: {
        userId: data.userId || null,
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
  const where = {
    createdAt: {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
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
    }),

    // 熱門頁面
    prisma.analytics.groupBy({
      by: ['page'],
      where: { ...where, event: 'page_view' },
      _count: true,
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    }),

    // 熱門事件
    prisma.analytics.groupBy({
      by: ['event'],
      where,
      _count: true,
      orderBy: { _count: { event: 'desc' } },
      take: 10,
    }),

    // 每日事件
    prisma.$queryRaw`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM "Analytics"
      WHERE created_at >= ${startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
        AND created_at <= ${endDate || new Date()}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `,
  ])

  return {
    totalEvents,
    pageViews,
    uniqueVisitors: uniqueVisitors.length,
    topPages: topPages.map((p) => ({ page: p.page, count: p._count })),
    topEvents: topEvents.map((e) => ({ event: e.event, count: e._count })),
    eventsByDay,
  }
}
