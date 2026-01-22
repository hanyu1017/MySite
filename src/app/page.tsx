'use client'

import { useEffect, useState } from 'react'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { Card } from '@/components/ui/Card'
import { useInView } from 'react-intersection-observer'
import { Github, Linkedin, Mail, Code, Briefcase, GraduationCap } from 'lucide-react'
import type { Profile } from '@/types'

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
      {/* Hero Section */}
      <section className="waterfall-section bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-20 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {profile?.name || '您的名字'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {profile?.title || '全端開發者 / 創作者'}
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="#projects"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                查看作品
              </a>
              <a
                href="#contact"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
              >
                聯絡我
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="waterfall-section bg-white">
        <div className="container mx-auto px-4 py-20">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              關於我
            </h2>
            <div className="max-w-3xl mx-auto">
              <Card>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {profile?.bio || '在這裡介紹您自己，包括您的背景、興趣和專業領域。'}
                </p>

                {/* Skills */}
                {profile?.skills && profile.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Code size={24} />
                      技能
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {profile?.education && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <GraduationCap size={24} />
                      學習歷程
                    </h3>
                    <div className="space-y-4">
                      {Array.isArray(profile.education) ? (
                        profile.education.map((edu: any, index: number) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-gray-800">{edu.school}</h4>
                            <p className="text-gray-600">{edu.degree}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-700">{JSON.stringify(profile.education)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {profile?.experience && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Briefcase size={24} />
                      工作經驗
                    </h3>
                    <div className="space-y-4">
                      {Array.isArray(profile.experience) ? (
                        profile.experience.map((exp: any, index: number) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-gray-800">{exp.company}</h4>
                            <p className="text-gray-600">{exp.position}</p>
                            <p className="text-sm text-gray-500">{exp.period}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-700">{JSON.stringify(profile.experience)}</p>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="waterfall-section bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              專案作品
            </h2>
            <ProjectGrid />
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="waterfall-section bg-white">
        <div className="container mx-auto px-4 py-20">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              聯絡方式
            </h2>
            <div className="max-w-2xl mx-auto">
              <Card>
                <div className="space-y-6">
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Mail className="text-blue-600" size={24} />
                      <span className="text-lg">{profile.email}</span>
                    </a>
                  )}
                  {profile?.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Github className="text-gray-800" size={24} />
                      <span className="text-lg">GitHub</span>
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Linkedin className="text-blue-700" size={24} />
                      <span className="text-lg">LinkedIn</span>
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

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  )
}
