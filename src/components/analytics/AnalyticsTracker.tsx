'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // 追蹤頁面瀏覽
    trackEvent('page_view', pathname)
  }, [pathname])

  return null
}

export async function trackEvent(
  event: string,
  page?: string,
  target?: string,
  metadata?: Record<string, any>
) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        page,
        target,
        metadata,
      }),
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}
