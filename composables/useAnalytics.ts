import { ref, reactive, computed } from 'vue'

export interface PageStat {
  views: number
  uniqueVisitors: number
  lastVisited?: string
}

export interface AnalyticsSummary {
  liveVisitors: number
  totalViews: number
  totalUniqueVisitors: number
  pages: Record<string, PageStat>
  articles: Record<string, PageStat>
  updatedAt?: string
}

const VISITOR_ID_KEY = 'hc_vid_v1'

const liveVisitors = ref<number>(1)
const totalViews = ref<number>(0)
const totalUniqueVisitors = ref<number>(0)
const pageStats = reactive<Record<string, PageStat>>({})
const articleStats = reactive<Record<string, PageStat>>({})
const isPulsing = ref<boolean>(false)

let heartbeatTimer: any = null
let pollTimer: any = null
let currentPath = '/'
let isInitialized = false

export const useAnalytics = () => {
  const getVisitorId = (): string => {
    if (typeof window === 'undefined') return ''
    try {
      let id = localStorage.getItem(VISITOR_ID_KEY)
      if (!id) {
        id = 'vid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36)
        localStorage.setItem(VISITOR_ID_KEY, id)
      }
      return id
    } catch {
      return 'vid_' + Date.now().toString(36)
    }
  }

  const triggerPulse = () => {
    isPulsing.value = true
    setTimeout(() => {
      isPulsing.value = false
    }, 4000)
  }

  const fetchLiveAnalytics = async (): Promise<AnalyticsSummary | null> => {
    if (typeof window === 'undefined') return null
    try {
      const resp = await fetch(`/api/analytics.php?_t=${Date.now()}`, { cache: 'no-store' })
      if (resp.ok) {
        const json = await resp.json()
        if (json && json.ok) {
          const prevLive = liveVisitors.value
          const newLive = Math.max(1, typeof json.liveVisitors === 'number' ? json.liveVisitors : 1)
          liveVisitors.value = newLive

          if (prevLive !== newLive) {
            triggerPulse()
          }

          totalViews.value = Number(json.totalViews || 0)
          totalUniqueVisitors.value = Number(json.totalUniqueVisitors || 0)

          if (json.pages && typeof json.pages === 'object') {
            Object.assign(pageStats, json.pages)
          }
          if (json.articles && typeof json.articles === 'object') {
            Object.assign(articleStats, json.articles)
          }

          return json
        }
      }
    } catch {
      // Fallback silently
    }
    return null
  }

  const sendPing = async (action: 'visit' | 'heartbeat', path: string, slug?: string, title?: string) => {
    if (typeof window === 'undefined') return
    // Never track CMS or admin internal paths as reader traffic
    if (path.startsWith('/cms') || path.startsWith('/admin')) return

    const visitorId = getVisitorId()
    try {
      const resp = await fetch('/api/analytics.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          visitorId,
          path,
          slug: slug || '',
          title: title || ''
        }),
        keepalive: true
      })
      if (resp.ok) {
        const json = await resp.json()
        if (json && json.ok) {
          if (typeof json.liveVisitors === 'number') {
            liveVisitors.value = Math.max(1, json.liveVisitors)
          }
          if (typeof json.totalViews === 'number') totalViews.value = json.totalViews
          if (typeof json.totalUniqueVisitors === 'number') totalUniqueVisitors.value = json.totalUniqueVisitors
          if (json.articleStats && slug) {
            articleStats[slug] = json.articleStats
          }
        }
      }
    } catch {
      // Network failure catch
    }
  }

  const recordPageView = (path: string, slug?: string, title?: string) => {
    if (typeof window === 'undefined') return
    currentPath = path
    sendPing('visit', path, slug, title)
  }

  const startHeartbeat = () => {
    if (typeof window === 'undefined' || isInitialized) return
    isInitialized = true

    // Heartbeat every 45 seconds while tab is open
    heartbeatTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sendPing('heartbeat', currentPath)
      }
    }, 45000)

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        sendPing('heartbeat', currentPath)
      }
    })
  }

  const startCmsPolling = () => {
    if (typeof window === 'undefined') return
    fetchLiveAnalytics()

    if (!pollTimer) {
      // Poll analytics every 30 seconds for live pulse in CMS
      pollTimer = setInterval(() => {
        fetchLiveAnalytics()
        triggerPulse()
      }, 30000)
    }
  }

  const stopCmsPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  const getArticleUniqueViews = (slugOrId?: string): number => {
    if (!slugOrId) return 0
    const stat = articleStats[slugOrId]
    if (stat && typeof stat.uniqueVisitors === 'number') {
      return stat.uniqueVisitors
    }
    // Check by path
    const pathKey = `/blog/${slugOrId}`
    if (pageStats[pathKey]?.uniqueVisitors) {
      return pageStats[pathKey].uniqueVisitors
    }
    return 0
  }

  const getArticleTotalViews = (slugOrId?: string): number => {
    if (!slugOrId) return 0
    const stat = articleStats[slugOrId]
    if (stat && typeof stat.views === 'number') {
      return stat.views
    }
    const pathKey = `/blog/${slugOrId}`
    if (pageStats[pathKey]?.views) {
      return pageStats[pathKey].views
    }
    return 0
  }

  return {
    liveVisitors,
    totalViews,
    totalUniqueVisitors,
    pageStats,
    articleStats,
    isPulsing,
    triggerPulse,
    recordPageView,
    startHeartbeat,
    fetchLiveAnalytics,
    startCmsPolling,
    stopCmsPolling,
    getArticleUniqueViews,
    getArticleTotalViews
  }
}

