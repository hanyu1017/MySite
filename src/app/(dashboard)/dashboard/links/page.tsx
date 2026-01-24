'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Edit2, Trash2, ExternalLink, Copy, Eye, EyeOff, BarChart3, ChevronDown, ChevronUp, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

interface LinkClick {
  id: string
  ipAddress: string | null
  userAgent: string | null
  referer: string | null
  country: string | null
  city: string | null
  createdAt: Date
}

interface TrackedLink {
  id: string
  slug: string
  url: string
  title: string
  description: string | null
  notes: string | null
  clicks: number
  enabled: boolean
  createdAt: Date
  _count?: {
    clickEvents: number
  }
  clickEvents?: LinkClick[]
}

export default function LinksManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [links, setLinks] = useState<TrackedLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<TrackedLink | null>(null)
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null)
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null)

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
      fetchLinks()
    }
  }, [session, status, router])

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links')
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      }
    } catch (error) {
      console.error('Failed to fetch links:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLinkDetails = async (id: string) => {
    setLoadingDetails(id)
    try {
      const response = await fetch(`/api/links/${id}`)
      if (response.ok) {
        const data = await response.json()
        setLinks(prevLinks =>
          prevLinks.map(link =>
            link.id === id ? { ...link, clickEvents: data.clickEvents } : link
          )
        )
      }
    } catch (error) {
      console.error('Failed to fetch link details:', error)
    } finally {
      setLoadingDetails(null)
    }
  }

  const toggleExpand = async (linkId: string) => {
    if (expandedLinkId === linkId) {
      setExpandedLinkId(null)
    } else {
      setExpandedLinkId(linkId)
      const link = links.find(l => l.id === linkId)
      if (!link?.clickEvents) {
        await fetchLinkDetails(linkId)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此連結嗎？所有點擊記錄也會被刪除。')) return

    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchLinks()
      } else {
        alert('刪除失敗')
      }
    } catch (error) {
      console.error('Failed to delete link:', error)
      alert('刪除失敗')
    }
  }

  const handleEdit = (link: TrackedLink) => {
    setEditingLink(link)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingLink(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingLink(null)
    fetchLinks()
  }

  const copyShortLink = (slug: string) => {
    const url = `${window.location.origin}/l/${slug}`
    navigator.clipboard.writeText(url)
    alert('短網址已複製！')
  }

  const downloadExcel = (link: TrackedLink) => {
    if (!link.clickEvents || link.clickEvents.length === 0) {
      alert('此連結沒有點擊記錄')
      return
    }

    const data = link.clickEvents.map((click, index) => ({
      '序號': index + 1,
      '點擊時間': new Date(click.createdAt).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      'IP 位址': click.ipAddress || '未知',
      '國家': click.country || '未知',
      '城市': click.city || '未知',
      '瀏覽器資訊': click.userAgent || '未知',
      '來源頁面': click.referer || '直接訪問',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '點擊記錄')

    // 設定欄寬
    const colWidths = [
      { wch: 8 },  // 序號
      { wch: 20 }, // 點擊時間
      { wch: 15 }, // IP 位址
      { wch: 12 }, // 國家
      { wch: 12 }, // 城市
      { wch: 50 }, // 瀏覽器資訊
      { wch: 40 }, // 來源頁面
    ]
    ws['!cols'] = colWidths

    const fileName = `${link.title}_點擊記錄_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">連結追蹤管理</h1>
            <p className="text-gray-600 mt-1 text-sm">管理您的追蹤連結並查看點擊統計</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={18} className="mr-2" />
            新增連結
          </Button>
        </div>

        {showForm && (
          <LinkForm
            link={editingLink}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        )}

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ExternalLink className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">總連結數</p>
                <p className="text-xl font-bold text-gray-900">{links.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">啟用中</p>
                <p className="text-xl font-bold text-gray-900">
                  {links.filter(l => l.enabled).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">總點擊數</p>
                <p className="text-xl font-bold text-gray-900">
                  {links.reduce((sum, l) => sum + l.clicks, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 連結列表 */}
        <div className="space-y-3">
          {links.map((link) => (
            <Card key={link.id} className="p-4">
              <div className="flex items-start gap-4">
                {/* 功能列（左側） */}
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(link)}
                    title="編輯"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                    className="text-red-600 hover:bg-red-50"
                    title="刪除"
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(link.id)}
                    title="查看記錄"
                  >
                    {expandedLinkId === link.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                  {link.clickEvents && link.clickEvents.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadExcel(link)}
                      title="下載 Excel"
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Download size={14} />
                    </Button>
                  )}
                </div>

                {/* 連結資訊（右側） */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {link.title}
                    </h3>
                    {link.enabled ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                        <Eye size={10} />
                        啟用
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                        <EyeOff size={10} />
                        停用
                      </span>
                    )}
                  </div>
                  {link.description && (
                    <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                  )}
                  {link.notes && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-800 font-semibold mb-0.5">備註</p>
                      <p className="text-xs text-yellow-900">{link.notes}</p>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                        /l/{link.slug}
                      </code>
                      <button
                        onClick={() => copyShortLink(link.slug)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="複製短網址"
                      >
                        <Copy size={14} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <ExternalLink size={12} />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 truncate max-w-md"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} />
                        {link.clicks.toLocaleString()} 次點擊
                      </span>
                      <span>
                        創建於 {new Date(link.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                  </div>

                  {/* 展開的操作記錄 */}
                  {expandedLinkId === link.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">操作記錄</h4>
                        {link.clickEvents && link.clickEvents.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadExcel(link)}
                            className="text-xs"
                          >
                            <Download size={12} className="mr-1" />
                            下載 Excel
                          </Button>
                        )}
                      </div>
                      {loadingDetails === link.id ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                      ) : link.clickEvents && link.clickEvents.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {link.clickEvents.map((click, index) => (
                            <div
                              key={click.id}
                              className="p-3 bg-gray-50 rounded-lg text-xs"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-gray-600">點擊時間：</span>
                                  <span className="text-gray-900 font-medium">
                                    {new Date(click.createdAt).toLocaleString('zh-TW', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">IP 位址：</span>
                                  <span className="text-gray-900 font-medium">
                                    {click.ipAddress || '未知'}
                                  </span>
                                </div>
                                {(click.country || click.city) && (
                                  <div>
                                    <span className="text-gray-600">位置：</span>
                                    <span className="text-gray-900 font-medium">
                                      {[click.country, click.city].filter(Boolean).join(', ') || '未知'}
                                    </span>
                                  </div>
                                )}
                                {click.referer && (
                                  <div>
                                    <span className="text-gray-600">來源：</span>
                                    <span className="text-gray-900 font-medium truncate block">
                                      {click.referer}
                                    </span>
                                  </div>
                                )}
                                {click.userAgent && (
                                  <div className="col-span-2">
                                    <span className="text-gray-600">瀏覽器：</span>
                                    <span className="text-gray-900 font-medium truncate block">
                                      {click.userAgent}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          暫無點擊記錄
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            暫無追蹤連結，點擊「新增連結」開始創建
          </div>
        )}
      </div>
    </div>
  )
}

function LinkForm({
  link,
  onSuccess,
  onCancel,
}: {
  link: TrackedLink | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    slug: link?.slug || '',
    url: link?.url || '',
    title: link?.title || '',
    description: link?.description || '',
    notes: link?.notes || '',
    enabled: link?.enabled ?? true,
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const data = {
        ...formData,
        description: formData.description || null,
        notes: formData.notes || null,
      }

      const url = link ? `/api/links/${link.id}` : '/api/links'
      const method = link ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.error || '操作失敗')
      }
    } catch (error) {
      console.error('Failed to save link:', error)
      alert('操作失敗')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-5 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {link ? '編輯連結' : '新增連結'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            標題 *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="我的追蹤連結"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug * <span className="text-xs text-gray-500">(短網址標識符，只能包含字母、數字、底線和破折號)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">/l/</span>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="my-link"
              pattern="[a-zA-Z0-9_-]+"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            目標網址 *
          </label>
          <Input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="關於此連結的描述..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            備註 <span className="text-xs text-gray-500">(例如：給了誰、使用場景等)</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-yellow-200 bg-yellow-50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="例如：給張三、用於 Facebook 廣告活動..."
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) =>
                setFormData({ ...formData, enabled: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">啟用此連結</span>
          </label>
        </div>

        <div className="flex gap-3 pt-3">
          <Button type="submit" disabled={saving} size="sm">
            {saving ? '保存中...' : link ? '更新連結' : '創建連結'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            取消
          </Button>
        </div>
      </form>
    </Card>
  )
}
