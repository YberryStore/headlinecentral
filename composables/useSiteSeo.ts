import { reactive } from 'vue'

export interface PageSeoEntry {
  key: string
  label: string
  path: string
  title: string
  description: string
  keywords: string
  ogImage: string
}

export interface SiteTrackingConfig {
  gtmId: string
  enableGtm: boolean
  ga4Id: string
  enableGa4: boolean
  metaPixelId: string
  enableMetaPixel: boolean
  adsensePublisherId: string
  enableAdsense: boolean
}

const SEO_STORAGE_KEY = 'hc_cms_page_seo_v1'
const TRACKING_STORAGE_KEY = 'hc_cms_tracking_v1'

const defaultPagesSeo: Record<string, PageSeoEntry> = {
  home: {
    key: 'home',
    label: 'Home Page',
    path: '/',
    title: 'Headline Central — Essential Stories Across Technology & Digital Culture',
    description: 'Headline Central brings you essential headlines, investigative technical analysis, hardware retrospectives, and digital architecture coverage.',
    keywords: 'Headline Central, technology news, hardware retrospectives, digital journalism, PC hardware, lifestyle',
    ogImage: '/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-desktop-banner.webp'
  },
  blog: {
    key: 'blog',
    label: 'News / All Articles Archive',
    path: '/blog',
    title: 'All Published Stories & Breaking News — Headline Central',
    description: 'Explore the complete archive of Headline Central articles across News, Technology, Fashion, Food, Home & DIY, and Parenting.',
    keywords: 'Headline Central archive, latest news, tech articles, hardware analysis, lifestyle stories',
    ogImage: '/images/tech-hero.jpg'
  },
  categories: {
    key: 'categories',
    label: 'Categories Directory',
    path: '/categories',
    title: 'Editorial Categories & Subject Focus — Headline Central',
    description: 'Explore articles organised by subject: News, Technology, Fashion, Food, Home & DIY, and Parenting.',
    keywords: 'Headline Central categories, technology, fashion, food, home and diy, parenting',
    ogImage: '/images/tech-hero.jpg'
  },
  about: {
    key: 'about',
    label: 'About Us Page',
    path: '/about',
    title: 'About Us — Headline Central Editorial & Journalistic Standards',
    description: 'Learn about Headline Central’s journalistic standards, editorial independence, and senior contributor team.',
    keywords: 'about Headline Central, editorial team, journalism standards, Dr. Marcus Vance',
    ogImage: '/images/tech-hero.jpg'
  },
  contact: {
    key: 'contact',
    label: 'Contact Us Page',
    path: '/contact',
    title: 'Contact Us — Headline Central Editorial Desk',
    description: 'Contact Headline Central for editorial pitches, press inquiries, corrections, or media partnerships.',
    keywords: 'contact Headline Central, press inquiry, story pitch, editorial desk',
    ogImage: '/images/tech-hero.jpg'
  },
  'editorial-policy': {
    key: 'editorial-policy',
    label: 'Editorial Policy Page',
    path: '/editorial-policy',
    title: 'Editorial Policy & Ethics — Headline Central',
    description: 'Our commitment to accuracy, source verification, independence, and transparent corrections at Headline Central.',
    keywords: 'editorial policy, journalism ethics, fact checking, Headline Central',
    ogImage: '/images/tech-hero.jpg'
  },
  privacy: {
    key: 'privacy',
    label: 'Privacy Policy Page',
    path: '/privacy',
    title: 'Privacy Policy — Headline Central',
    description: 'Read how Headline Central collects, protects, and respects your personal data and cookie preferences.',
    keywords: 'privacy policy, data protection, cookies, Headline Central',
    ogImage: '/images/tech-hero.jpg'
  },
  terms: {
    key: 'terms',
    label: 'Terms of Service Page',
    path: '/terms',
    title: 'Terms of Service — Headline Central',
    description: 'Terms and conditions governing the use of Headline Central’s digital publication and content archive.',
    keywords: 'terms of service, user agreement, copyright, Headline Central',
    ogImage: '/images/tech-hero.jpg'
  },
  cookies: {
    key: 'cookies',
    label: 'Cookie Policy Page',
    path: '/cookies',
    title: 'Cookie Policy & POPIA Act Compliance — Headline Central',
    description: 'Manage cookie preferences and learn about tracking technology governance and POPIA Act compliance at Headline Central.',
    keywords: 'cookie policy, cookie preferences, POPIA, privacy, cookies, Headline Central',
    ogImage: '/images/tech-hero.jpg'
  }
}

const sharedPagesSeo = reactive<Record<string, PageSeoEntry>>({})
const sharedTracking = reactive<SiteTrackingConfig>({
  gtmId: 'GTM-PNT79WT8',
  enableGtm: true,
  ga4Id: 'G-TD8S7EFPLV',
  enableGa4: true,
  metaPixelId: '',
  enableMetaPixel: true,
  adsensePublisherId: '',
  enableAdsense: true
})

let isSeoInitialized = false

// Strict validators to prevent script injection via tracking IDs
export const sanitizeGtmId = (val: string): string => {
  const clean = (val || '').trim().toUpperCase()
  return /^GTM-[A-Z0-9]{4,12}$/.test(clean) ? clean : ''
}

export const sanitizeGa4Id = (val: string): string => {
  const clean = (val || '').trim().toUpperCase()
  return /^G-[A-Z0-9]{6,16}$/.test(clean) ? clean : ''
}

export const sanitizeMetaPixelId = (val: string): string => {
  const clean = (val || '').trim()
  return /^\d{8,20}$/.test(clean) ? clean : ''
}

export const sanitizeAdsenseId = (val: string): string => {
  const clean = (val || '').trim()
  if (!clean) return ''
  // Accept pub-1234567890123456 or ca-pub-1234567890123456
  const matched = clean.match(/^(?:ca-)?(pub-\d{10,20})$/i)
  return matched ? `ca-${matched[1].toLowerCase()}` : ''
}

export const useSiteSeo = () => {
  const runtimeConfig = useRuntimeConfig()

  if (!isSeoInitialized) {
    Object.keys(defaultPagesSeo).forEach((k) => {
      sharedPagesSeo[k] = { ...defaultPagesSeo[k] }
    })

    const pubAnalytics = (runtimeConfig.public as any)?.analytics || {}
    sharedTracking.gtmId = pubAnalytics.gtmId || ''
    sharedTracking.ga4Id = pubAnalytics.ga4Id || ''
    sharedTracking.metaPixelId = pubAnalytics.metaPixelId || ''
    sharedTracking.enableGtm = true
    sharedTracking.enableGa4 = true
    sharedTracking.enableMetaPixel = true

    if (typeof window !== 'undefined') {
      try {
        const savedSeo = localStorage.getItem(SEO_STORAGE_KEY)
        if (savedSeo) {
          const parsedSeo = JSON.parse(savedSeo)
          if (parsedSeo && typeof parsedSeo === 'object') {
            Object.keys(defaultPagesSeo).forEach((k) => {
              if (parsedSeo[k]) {
                sharedPagesSeo[k] = {
                  ...defaultPagesSeo[k],
                  ...parsedSeo[k]
                }
              }
            })
          }
        }
      } catch {
        // Ignore storage parse error
      }

      try {
        const savedTracking = localStorage.getItem(TRACKING_STORAGE_KEY)
        if (savedTracking) {
          const parsedTracking = JSON.parse(savedTracking)
          if (parsedTracking && typeof parsedTracking === 'object') {
            if (typeof parsedTracking.gtmId === 'string') sharedTracking.gtmId = parsedTracking.gtmId.trim()
            if (typeof parsedTracking.ga4Id === 'string') sharedTracking.ga4Id = parsedTracking.ga4Id.trim()
            if (typeof parsedTracking.metaPixelId === 'string') sharedTracking.metaPixelId = parsedTracking.metaPixelId.trim()
            if (typeof parsedTracking.enableGtm === 'boolean') sharedTracking.enableGtm = parsedTracking.enableGtm
            if (typeof parsedTracking.enableGa4 === 'boolean') sharedTracking.enableGa4 = parsedTracking.enableGa4
            if (typeof parsedTracking.enableMetaPixel === 'boolean') sharedTracking.enableMetaPixel = parsedTracking.enableMetaPixel
            if (typeof parsedTracking.adsensePublisherId === 'string') sharedTracking.adsensePublisherId = parsedTracking.adsensePublisherId.trim()
            if (typeof parsedTracking.enableAdsense === 'boolean') sharedTracking.enableAdsense = parsedTracking.enableAdsense
          }
        }
      } catch {
        // Ignore storage parse error
      }
    }

    isSeoInitialized = true
  }

  const persistSeoAndTracking = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(sharedPagesSeo))
        localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(sharedTracking))
      } catch {
        // Ignore storage error
      }
    }
  }

  const updatePageSeo = (key: string, updates: Partial<PageSeoEntry>) => {
    if (!sharedPagesSeo[key]) return
    sharedPagesSeo[key] = {
      ...sharedPagesSeo[key],
      ...updates
    }
    persistSeoAndTracking()
  }

  const updateTrackingConfig = (updates: Partial<SiteTrackingConfig>) => {
    Object.assign(sharedTracking, updates)
    persistSeoAndTracking()
  }

  const applyPageSeo = (key: keyof typeof defaultPagesSeo) => {
    const entry = computed(() => sharedPagesSeo[key] || defaultPagesSeo[key])
    useHead({
      title: () => entry.value.title,
      meta: [
        { name: 'description', content: () => entry.value.description },
        { name: 'keywords', content: () => entry.value.keywords },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Headline Central' },
        { property: 'og:title', content: () => entry.value.title },
        { property: 'og:description', content: () => entry.value.description },
        { property: 'og:image', content: () => entry.value.ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: () => entry.value.title },
        { name: 'twitter:description', content: () => entry.value.description },
        { name: 'twitter:image', content: () => entry.value.ogImage }
      ]
    })
  }

  return {
    pagesSeo: sharedPagesSeo,
    trackingConfig: sharedTracking,
    updatePageSeo,
    updateTrackingConfig,
    applyPageSeo,
    sanitizeGtmId,
    sanitizeGa4Id,
    sanitizeMetaPixelId
  }
}

