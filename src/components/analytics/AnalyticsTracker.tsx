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

// 從 cookie 中獲取 tracking session
function getTrackingSession(): string | null {
  if (typeof window === 'undefined') return null

  const cookies = document.cookie.split(';')
  const trackingCookie = cookies.find(cookie =>
    cookie.trim().startsWith('_track_session=')
  )

  if (trackingCookie) {
    return trackingCookie.split('=')[1].trim()
  }

  return null
}

export async function trackEvent(
  event: string,
  page?: string,
  target?: string,
  metadata?: Record<string, any>
) {
  try {
    const trackingSession = getTrackingSession()

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
        trackingSession,  // 傳遞 tracking session
      }),
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}
