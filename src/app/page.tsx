'use client'

import { useEffect, useState } from 'react'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { Card } from '@/components/ui/Card'
import { useInView } from 'react-intersection-observer'
import { Github, Linkedin, Mail, Code, Briefcase, GraduationCap, Calendar } from 'lucide-react'
import type { Profile } from '@/types'
import Image from 'next/image'

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  return (
    <div className="pt-16">
      {/* Hero Section - 全屏介紹 */}
      <section className="waterfall-section min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* 動態背景裝飾 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-20 -left-20 animate-blob"></div>
          <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -bottom-20 -right-20 animate-blob animation-delay-2000"></div>
          <div className="absolute w-96 h-96 bg-pink-400/20 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 左側 - 照片區 */}
            <AnimatedSection delay={0} className="lg:col-span-4">
              <div className="relative group">
                {/* 照片容器 */}
                <div className="relative w-full max-w-sm mx-auto">
                  {/* 裝飾性邊框 */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                  {/* 照片 */}
                  <div className="relative bg-white rounded-2xl p-2 shadow-2xl">
                    {profile?.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.name || '個人照片'}
                        width={400}
                        height={400}
                        className="w-full h-auto rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {profile?.name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">登入後可在「編輯資料」上傳照片</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 浮動裝飾元素 */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
                </div>

                {/* 社交媒體連結 */}
                <div className="flex justify-center gap-4 mt-8">
                  {profile?.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                      aria-label="GitHub"
                    >
                      <Github size={24} className="text-gray-800" />
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={24} className="text-blue-700" />
                    </a>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                      aria-label="Email"
                    >
                      <Mail size={24} className="text-red-600" />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* 右側 - 基本資料 */}
            <AnimatedSection delay={200} className="lg:col-span-8">
              <div className="space-y-6">
                {/* 名字和職稱 */}
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {profile?.name || '您的名字'}
                  </h1>
                  <p className="text-2xl md:text-3xl text-gray-700 mb-6">
                    {profile?.title || '您的職稱'}
                  </p>
                </div>

                {/* 個人簡介 */}
                <p className="text-lg text-gray-600 leading-relaxed">
                  {profile?.bio || '在這裡介紹您自己...'}
                </p>

                {/* 快速信息卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {/* 學歷卡片 */}
                  {profile?.education && profile.education.length > 0 && (
                    <Card hover className="bg-white/80 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <GraduationCap className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">最高學歷</h3>
                          <p className="text-sm text-gray-600">
                            {(profile.education[0] as any).degree}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(profile.education[0] as any).school}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* 經驗卡片 */}
                  {profile?.experience && profile.experience.length > 0 && (
                    <Card hover className="bg-white/80 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Briefcase className="text-green-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">最新經歷</h3>
                          <p className="text-sm text-gray-600">
                            {(profile.experience[0] as any).position}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(profile.experience[0] as any).company}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* 技能總數 */}
                  {profile?.skills && profile.skills.length > 0 && (
                    <Card hover className="bg-white/80 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Code className="text-purple-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">專業技能</h3>
                          <p className="text-sm text-gray-600">
                            {profile.skills.length} 項核心技術
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {profile.skills.slice(0, 3).join(', ')}...
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* 聯絡方式 */}
                  {profile?.email && (
                    <Card hover className="bg-white/80 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Mail className="text-pink-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">聯絡我</h3>
                          <p className="text-sm text-gray-600 truncate">
                            {profile.email}
                          </p>
                          <a
                            href={`mailto:${profile.email}`}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                          >
                            發送郵件 →
                          </a>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* CTA 按鈕 */}
                <div className="flex flex-wrap gap-4 pt-6">
                  <a
                    href="#projects"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    查看作品集 →
                  </a>
                  <a
                    href="#contact"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold"
                  >
                    聯絡我
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* 向下滾動指示器 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section - 詳細資料 */}
      <section id="about" className="waterfall-section bg-white">
        <div className="container mx-auto px-4 py-12">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                關於我
              </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* 技能 */}
              {profile?.skills && profile.skills.length > 0 && (
                <AnimatedSection delay={100}>
                  <Card className="h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <Code size={28} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800">專業技能</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-full font-medium hover:scale-105 transition-transform duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Card>
                </AnimatedSection>
              )}

              {/* 學歷 */}
              {profile?.education && profile.education.length > 0 && (
                <AnimatedSection delay={200}>
                  <Card className="h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
                        <GraduationCap size={28} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800">學習歷程</h3>
                    </div>
                    <div className="space-y-6">
                      {(profile.education as any[]).map((edu: any, index: number) => (
                        <div key={index} className="relative pl-6 border-l-4 border-green-500 hover:border-green-600 transition-colors">
                          <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[8px] top-1"></div>
                          <h4 className="font-semibold text-gray-800 text-lg">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar size={14} />
                            {edu.year}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-gray-600 mt-2">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </AnimatedSection>
              )}
            </div>

            {/* 工作經驗 */}
            {profile?.experience && profile.experience.length > 0 && (
              <AnimatedSection delay={300}>
                <Card className="mt-8 max-w-6xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                      <Briefcase size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">工作經驗</h3>
                  </div>
                  <div className="space-y-6">
                    {(profile.experience as any[]).map((exp: any, index: number) => (
                      <div key={index} className="relative pl-6 border-l-4 border-orange-500 hover:border-orange-600 transition-colors">
                        <div className="absolute w-3 h-3 bg-orange-500 rounded-full -left-[8px] top-1"></div>
                        <h4 className="font-semibold text-gray-800 text-lg">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar size={14} />
                          {exp.period}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="waterfall-section bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                精選專案
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              以下是我參與開發的部分專案，展示了我的技術能力和問題解決思維
            </p>
            <ProjectGrid />
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="waterfall-section bg-white">
        <div className="container mx-auto px-4 py-12">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                聯絡我
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              如果您有任何問題或合作機會，歡迎與我聯繫
            </p>
            <div className="max-w-2xl mx-auto">
              <Card>
                <div className="space-y-4">
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Mail className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Email</p>
                        <span className="text-gray-600">{profile.email}</span>
                      </div>
                    </a>
                  )}
                  {profile?.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                      <div className="p-3 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Github className="text-gray-800" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">GitHub</p>
                        <span className="text-gray-600">查看我的開源項目</span>
                      </div>
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all group"
                    >
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Linkedin className="text-blue-700" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">LinkedIn</p>
                        <span className="text-gray-600">專業聯繫</span>
                      </div>
                    </a>
                  )}
                </div>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

function AnimatedSection({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
