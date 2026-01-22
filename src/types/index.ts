export interface User {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'VISITOR'
  createdAt: Date
}

export interface Project {
  id: string
  title: string
  description: string
  content: string
  thumbnail?: string | null
  tags: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  order: number
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar?: string | null
  email?: string | null
  github?: string | null
  linkedin?: string | null
  twitter?: string | null
  skills: string[]
  education?: any
  experience?: any
}

export interface Analytics {
  totalEvents: number
  pageViews: number
  uniqueVisitors: number
  topPages: { page: string | null; count: number }[]
  topEvents: { event: string; count: number }[]
  eventsByDay: any[]
}
