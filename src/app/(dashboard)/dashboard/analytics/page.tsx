'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Eye, Users, MousePointer, Calendar, ExternalLink, BarChart3 } from 'lucide-react'
import type { Analytics } from '@/types'

interface TrackedLinkStats {
  id: string
  slug: string
  title: string
  notes: string | null
  clicks: number
  enabled: boolean
  _count: {
    clickEvents: number
  }
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [linkStats, setLinkStats] = useState<TrackedLinkStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session && session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    if (session) {
      fetchAnalytics()
      fetchLinkStats()
    }
  }, [session, status, router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLinkStats = async () => {
    try {
      const response = await fetch('/api/links')
      if (response.ok) {
        const data = await response.json()
        // 按點擊數排序
        const sorted = data.sort((a: TrackedLinkStats, b: TrackedLinkStats) => b.clicks - a.clicks)
        setLinkStats(sorted)
      }
    } catch (error) {
      console.error('Failed to fetch link stats:', error)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-gray-600">無法載入分析數據</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">分析儀表板</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Eye className="text-blue-600" />}
            title="總事件數"
            value={analytics.totalEvents.toLocaleString()}
          />
          <StatCard
            icon={<MousePointer className="text-green-600" />}
            title="頁面瀏覽數"
            value={analytics.pageViews.toLocaleString()}
          />
          <StatCard
            icon={<Users className="text-purple-600" />}
            title="唯一訪客"
            value={analytics.uniqueVisitors.toLocaleString()}
          />
          <StatCard
            icon={<Calendar className="text-orange-600" />}
            title="追蹤天數"
            value={analytics.eventsByDay.length.toLocaleString()}
          />
        </div>

        {/* 連結點擊統計 */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            追蹤連結統計
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700">連結</th>
                  <th className="text-left py-3 px-4 text-gray-700">備註</th>
                  <th className="text-center py-3 px-4 text-gray-700">狀態</th>
                  <th className="text-right py-3 px-4 text-gray-700">點擊數</th>
                </tr>
              </thead>
              <tbody>
                {linkStats.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      暫無追蹤連結
                    </td>
                  </tr>
                ) : (
                  linkStats.map((link) => (
                    <tr key={link.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-semibold text-gray-900">{link.title}</div>
                          <code className="text-xs text-blue-600">/l/{link.slug}</code>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {link.notes ? (
                          <span className="text-sm text-gray-700">{link.notes}</span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">未設定</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {link.enabled ? (
                          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            <Eye size={12} className="mr-1" />
                            啟用
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            停用
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-gray-900 text-lg">
                          {link.clicks.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {linkStats.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">總連結數：{linkStats.length}</span>
                <span className="text-sm font-semibold text-gray-900">
                  總點擊數：{linkStats.reduce((sum, link) => sum + link.clicks, 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">熱門頁面</h2>
            <div className="space-y-3">
              {analytics.topPages.slice(0, 5).map((page, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{page.page || '首頁'}</span>
                  <span className="font-semibold text-blue-600">{page.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Events */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">熱門事件</h2>
            <div className="space-y-3">
              {analytics.topEvents.slice(0, 5).map((event, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{event.event}</span>
                  <span className="font-semibold text-green-600">{event.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Events by Day */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">每日事件統計</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700">日期</th>
                  <th className="text-right py-3 px-4 text-gray-700">事件數</th>
                </tr>
              </thead>
              <tbody>
                {analytics.eventsByDay.slice(0, 10).map((day: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(day.date).toLocaleDateString('zh-TW')}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {day.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  )
}
