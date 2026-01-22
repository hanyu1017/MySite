import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-lg p-6
        ${hover ? 'transition-transform duration-300 hover:scale-105 hover:shadow-xl' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
