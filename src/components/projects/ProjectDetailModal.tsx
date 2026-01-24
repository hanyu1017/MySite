'use client'

import { Modal } from '@/components/ui/Modal'
import { Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import type { Project } from '@/types'
import { trackEvent } from '@/components/analytics/AnalyticsTracker'

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  if (!project) return null

  const handleLinkClick = (linkType: string, url: string) => {
    trackEvent('link_click', undefined, linkType, {
      projectId: project.id,
      projectTitle: project.title,
      url,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      {/* 專案圖片 */}
      {project.thumbnail && (
        <div className="relative w-full h-64 md:h-96 mb-6 rounded-xl overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 專案標題 */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {project.title}
      </h1>

      {/* 標籤 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 簡短描述 */}
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
        {project.description}
      </p>

      {/* 連結按鈕 */}
      {(project.githubUrl || project.liveUrl) && (
        <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick('github', project.githubUrl!)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              <Github size={20} />
              查看 GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick('live_demo', project.liveUrl!)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ExternalLink size={20} />
              查看 Live Demo
            </a>
          )}
        </div>
      )}

      {/* 詳細內容 */}
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">專案詳情</h2>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {project.content}
        </div>
      </div>

      {/* 專案資訊 */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="font-medium">建立時間：</span>
            {new Date(project.createdAt).toLocaleDateString('zh-TW')}
          </div>
          <div>
            <span className="font-medium">更新時間：</span>
            {new Date(project.updatedAt).toLocaleDateString('zh-TW')}
          </div>
        </div>
      </div>
    </Modal>
  )
}
