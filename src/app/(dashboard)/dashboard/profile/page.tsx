'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, Save } from 'lucide-react'

interface Education {
  school: string
  degree: string
  year: string
  description?: string
}

interface Experience {
  company: string
  position: string
  period: string
  description?: string
}

interface ProfileData {
  name: string
  title: string
  bio: string
  avatar?: string
  email?: string
  github?: string
  linkedin?: string
  twitter?: string
  skills: string[]
  education: Education[]
  experience: Experience[]
}

export default function ProfileEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    title: '',
    bio: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    skills: [],
    education: [],
    experience: [],
  })
  const [newSkill, setNewSkill] = useState('')

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
      fetchProfile()
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
          email: data.email || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          twitter: data.twitter || '',
          skills: data.skills || [],
          education: data.education || [],
          experience: data.experience || [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        alert('個人資料已更新！')
      } else {
        alert('更新失敗，請稍後再試')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('更新失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((_, i) => i !== index),
    })
  }

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        { school: '', degree: '', year: '', description: '' },
      ],
    })
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...profile.education]
    updated[index] = { ...updated[index], [field]: value }
    setProfile({ ...profile, education: updated })
  }

  const removeEducation = (index: number) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    })
  }

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [
        ...profile.experience,
        { company: '', position: '', period: '', description: '' },
      ],
    })
  }

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...profile.experience]
    updated[index] = { ...updated[index], [field]: value }
    setProfile({ ...profile, experience: updated })
  }

  const removeExperience = (index: number) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index),
    })
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">編輯個人資料</h1>
          <Button onClick={handleSave} disabled={saving}>
            <Save size={18} className="mr-2" />
            {saving ? '儲存中...' : '儲存'}
          </Button>
        </div>

        {/* 基本資訊 */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">基本資訊</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="您的姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                職稱
              </label>
              <Input
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="例如：全端開發者 / 資訊管理碩士"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個人照片 URL
              </label>
              <Input
                value={profile.avatar || ''}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                placeholder="https://example.com/your-photo.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                請提供圖片的公開連結 URL（建議使用 Imgur、Cloudinary 等圖床服務）
              </p>
              {profile.avatar && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">照片預覽：</p>
                  <img
                    src={profile.avatar}
                    alt="照片預覽"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個人簡介
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="介紹您自己..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* 聯絡資訊 */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">聯絡資訊</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <Input
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <Input
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </Card>

        {/* 技能 */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">技能</h2>
          <div className="mb-4 flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="添加新技能"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill}>
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  className="text-blue-700 hover:text-blue-900"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* 學歷 */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">學歷</h2>
            <Button onClick={addEducation}>
              <Plus size={18} className="mr-2" />
              新增學歷
            </Button>
          </div>
          <div className="space-y-4">
            {profile.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(index, 'school', e.target.value)}
                    placeholder="學校名稱"
                  />
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="學位"
                  />
                  <Input
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    placeholder="年份"
                  />
                  <textarea
                    value={edu.description || ''}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    placeholder="描述（可選）"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 工作經驗 */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">工作經驗</h2>
            <Button onClick={addExperience}>
              <Plus size={18} className="mr-2" />
              新增經驗
            </Button>
          </div>
          <div className="space-y-4">
            {profile.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="公司名稱"
                  />
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(index, 'position', e.target.value)}
                    placeholder="職位"
                  />
                  <Input
                    value={exp.period}
                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                    placeholder="期間"
                  />
                  <textarea
                    value={exp.description || ''}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="工作描述（可選）"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 儲存按鈕 */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="px-8">
            <Save size={18} className="mr-2" />
            {saving ? '儲存中...' : '儲存所有變更'}
          </Button>
        </div>
      </div>
    </div>
  )
}
