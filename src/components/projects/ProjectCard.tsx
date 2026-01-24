'use client'

import { Card } from '@/components/ui/Card'
import { Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { trackEvent } from '@/components/analytics/AnalyticsTracker'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const handleCardClick = () => {
    trackEvent('project_view', undefined, project.id, {
      title: project.title,
    })
    onClick?.()
  }

  return (
    <Card hover className="h-full flex flex-col cursor-pointer" onClick={handleCardClick}>
      {project.thumbnail && (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            onClick={(e) => {
              e.stopPropagation()
              trackEvent('link_click', undefined, 'github', {
                projectId: project.id,
                url: project.githubUrl,
              })
            }}
          >
            <Github size={18} />
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            onClick={(e) => {
              e.stopPropagation()
              trackEvent('link_click', undefined, 'live_demo', {
                projectId: project.id,
                url: project.liveUrl,
              })
            }}
          >
            <ExternalLink size={18} />
            Live Demo
          </a>
        )}
      </div>
    </Card>
  )
}
