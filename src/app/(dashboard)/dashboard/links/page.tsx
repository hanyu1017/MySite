'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Edit2, Trash2, ExternalLink, Copy, Eye, EyeOff, BarChart3 } from 'lucide-react'

interface TrackedLink {
  id: string
  slug: string
  url: string
  title: string
  description: string | null
  clicks: number
  enabled: boolean
  createdAt: Date
  _count?: {
    clickEvents: number
  }
}

export default function LinksManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [links, setLinks] = useState<TrackedLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<TrackedLink | null>(null)

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

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">連結追蹤管理</h1>
            <p className="text-gray-600 mt-2">管理您的追蹤連結並查看點擊統計</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} className="mr-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ExternalLink className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">總連結數</p>
                <p className="text-2xl font-bold text-gray-900">{links.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">啟用中</p>
                <p className="text-2xl font-bold text-gray-900">
                  {links.filter(l => l.enabled).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">總點擊數</p>
                <p className="text-2xl font-bold text-gray-900">
                  {links.reduce((sum, l) => sum + l.clicks, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 連結列表 */}
        <div className="grid grid-cols-1 gap-4">
          {links.map((link) => (
            <Card key={link.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {link.title}
                    </h3>
                    {link.enabled ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        <Eye size={12} />
                        啟用
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        <EyeOff size={12} />
                        停用
                      </span>
                    )}
                  </div>
                  {link.description && (
                    <p className="text-gray-600 mb-3">{link.description}</p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono">
                        /l/{link.slug}
                      </code>
                      <button
                        onClick={() => copyShortLink(link.slug)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="複製短網址"
                      >
                        <Copy size={16} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ExternalLink size={14} />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 truncate max-w-md"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <BarChart3 size={14} />
                        {link.clicks.toLocaleString()} 次點擊
                      </span>
                      <span>
                        創建於 {new Date(link.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(link)}
                  >
                    <Edit2 size={16} className="mr-1" />
                    編輯
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} className="mr-1" />
                    刪除
                  </Button>
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
    <Card className="p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {link ? '編輯連結' : '新增連結'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug * <span className="text-xs text-gray-500">(短網址標識符，只能包含字母、數字、底線和破折號)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">/l/</span>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="關於此連結的描述..."
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

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? '保存中...' : link ? '更新連結' : '創建連結'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        </div>
      </form>
    </Card>
  )
}
