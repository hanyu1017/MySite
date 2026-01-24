'use client'

import { useEffect, useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { useInView } from 'react-intersection-observer'
import type { Project } from '@/types'

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?published=true')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        暫無專案展示
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <AnimatedProjectCard key={project.id} project={project} delay={index * 100} />
      ))}
    </div>
  )
}

function AnimatedProjectCard({ project, delay }: { project: Project; delay: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <ProjectCard project={project} />
    </div>
  )
}
