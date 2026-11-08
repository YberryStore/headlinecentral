import { ref, computed } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useFirebase } from '~/composables/useFirebase'

export type BannerMediaType = 'image' | 'video'
export type BannerCtaStyle = 'primary' | 'dark' | 'outline' | 'white'

export interface BannerCtaConfig {
  enabled: boolean
  label: string
  url?: string
  targetBlank?: boolean
  style?: BannerCtaStyle
}

export interface HeroBanner {
  id: string
  headline: string
  headlineHighlight?: string
  caption: string
  badgeText?: string
  mediaType: BannerMediaType
  
  // Desktop Media
  desktopImageUrl: string
  desktopAlt: string
  
  // Mobile Media
  mobileImageUrl?: string
  mobileAlt?: string
  
  // Video Options
  videoUrl?: string
  videoPosterUrl?: string
  videoAutoplay?: boolean
  videoLoop?: boolean
  videoMuted?: boolean
  
  // Target & Call to Action
  customUrl: string
  cta: BannerCtaConfig
  
  // Scheduling & Expiration
  startDate?: string
  expirationDate?: string
  
  // Controls
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'hc_cms_hero_banners_v1'

const defaultBanners: HeroBanner[] = [
  {
    id: 'banner-default-1',
    headline: 'The Architecture of Modern Compute.',
    headlineHighlight: 'Modern Compute',
    caption: 'An investigative inquiry into next-generation silicon, liquid cooling topologies, and the geopolitical battle for semiconductor supremacy.',
    badgeText: 'Featured Story',
    mediaType: 'image',
    desktopImageUrl: '/images/tech-hero.jpg',
    desktopAlt: 'Modern compute datacenter server infrastructure',
    mobileImageUrl: '/images/tech-hero.jpg',
    mobileAlt: 'Datacenter server hardware',
    customUrl: '/categories/technology',
    cta: {
      enabled: true,
      label: 'Read Story',
      url: '/categories/technology',
      targetBlank: false,
      style: 'primary'
    },
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const banners = ref<HeroBanner[]>([])
const isInitialized = ref(false)
const isSyncing = ref(false)
const isSaving = ref(false)

export const isBannerExpired = (banner: HeroBanner): boolean => {
  if (!banner.expirationDate) return false
  const expTime = new Date(banner.expirationDate).getTime()
  return !isNaN(expTime) && expTime <= Date.now()
}

export const isBannerScheduled = (banner: HeroBanner): boolean => {
  if (!banner.startDate) return false
  const startTime = new Date(banner.startDate).getTime()
  return !isNaN(startTime) && startTime > Date.now()
}

export const isBannerActive = (banner: HeroBanner): boolean => {
  if (banner.isActive === false) return false
  if (isBannerExpired(banner)) return false
  if (isBannerScheduled(banner)) return false
  return true
}

export const useBanners = () => {
  const initBanners = () => {
    if (isInitialized.value) return

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) {
            banners.value = parsed
          } else {
            banners.value = JSON.parse(JSON.stringify(defaultBanners))
          }
        } else {
          banners.value = JSON.parse(JSON.stringify(defaultBanners))
        }
      } catch (err) {
        console.warn('[useBanners] Failed to read from localStorage:', err)
        banners.value = JSON.parse(JSON.stringify(defaultBanners))
      }
    } else {
      banners.value = JSON.parse(JSON.stringify(defaultBanners))
    }

    isInitialized.value = true
  }

  initBanners()

  const persistToLocal = () => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(banners.value))
    } catch (err) {
      console.warn('[useBanners] Failed to write to localStorage:', err)
    }
  }

  const syncFromFirestore = async (): Promise<void> => {
    if (typeof window === 'undefined') return
    isSyncing.value = true
    try {
      const { initFirebase } = useFirebase()
      initFirebase()
      // @ts-ignore
      const db = (window as any).__hc_firestore_instance
      if (!db) return

      const snap = await getDoc(doc(db, 'system_settings', 'hero_banners'))
      if (snap.exists()) {
        const data = snap.data()
        if (data && Array.isArray(data.banners)) {
          banners.value = data.banners
          persistToLocal()
        }
      }
    } catch (err) {
      console.warn('[useBanners] Firestore sync warning:', err)
    } finally {
      isSyncing.value = false
    }
  }

  const saveBannersToCloud = async (): Promise<void> => {
    persistToLocal()
    if (typeof window === 'undefined') return

    isSaving.value = true
    try {
      const { initFirebase } = useFirebase()
      initFirebase()
      // @ts-ignore
      const db = (window as any).__hc_firestore_instance
      if (!db) return

      await setDoc(doc(db, 'system_settings', 'hero_banners'), {
        banners: JSON.parse(JSON.stringify(banners.value)),
        updatedAt: new Date().toISOString()
      }, { merge: true })
    } catch (err) {
      console.warn('[useBanners] Cloud save warning:', err)
    } finally {
      isSaving.value = false
    }
  }

  const activeBanners = computed(() => {
    return banners.value
      .filter(b => isBannerActive(b))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  })

  const saveBanner = async (item: Partial<HeroBanner>): Promise<HeroBanner> => {
    const now = new Date().toISOString()
    let savedBanner: HeroBanner

    if (item.id) {
      // Update existing
      const index = banners.value.findIndex(b => b.id === item.id)
      if (index !== -1) {
        savedBanner = {
          ...banners.value[index],
          ...item,
          updatedAt: now
        } as HeroBanner
        banners.value[index] = savedBanner
      } else {
        savedBanner = {
          id: item.id,
          headline: item.headline || 'Untitled Banner',
          caption: item.caption || '',
          mediaType: item.mediaType || 'image',
          desktopImageUrl: item.desktopImageUrl || '/images/tech-hero.jpg',
          desktopAlt: item.desktopAlt || item.headline || 'Banner image',
          customUrl: item.customUrl || '/',
          cta: item.cta || { enabled: true, label: 'Read Story', url: item.customUrl || '/', style: 'primary' },
          isActive: item.isActive !== false,
          sortOrder: item.sortOrder ?? (banners.value.length + 1),
          createdAt: now,
          updatedAt: now,
          ...item
        } as HeroBanner
        banners.value.push(savedBanner)
      }
    } else {
      // Create new
      savedBanner = {
        id: `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        headline: item.headline || 'New Hero Headline',
        headlineHighlight: item.headlineHighlight || '',
        caption: item.caption || '',
        badgeText: item.badgeText || 'Featured',
        mediaType: item.mediaType || 'image',
        desktopImageUrl: item.desktopImageUrl || '/images/tech-hero.jpg',
        desktopAlt: item.desktopAlt || item.headline || 'Hero image',
        mobileImageUrl: item.mobileImageUrl || '',
        mobileAlt: item.mobileAlt || '',
        videoUrl: item.videoUrl || '',
        videoPosterUrl: item.videoPosterUrl || '',
        videoAutoplay: item.videoAutoplay !== false,
        videoLoop: item.videoLoop !== false,
        videoMuted: item.videoMuted !== false,
        customUrl: item.customUrl || '/blog',
        cta: item.cta || {
          enabled: true,
          label: 'Explore Now',
          url: item.customUrl || '/blog',
          targetBlank: false,
          style: 'primary'
        },
        startDate: item.startDate || '',
        expirationDate: item.expirationDate || '',
        isActive: item.isActive !== false,
        sortOrder: item.sortOrder ?? (banners.value.length + 1),
        createdAt: now,
        updatedAt: now
      }
      banners.value.unshift(savedBanner)
    }

    await saveBannersToCloud()
    return savedBanner
  }

  const deleteBanner = async (id: string): Promise<void> => {
    banners.value = banners.value.filter(b => b.id !== id)
    await saveBannersToCloud()
  }

  const toggleBannerActive = async (id: string): Promise<void> => {
    const banner = banners.value.find(b => b.id === id)
    if (banner) {
      banner.isActive = !banner.isActive
      banner.updatedAt = new Date().toISOString()
      await saveBannersToCloud()
    }
  }

  const duplicateBanner = async (id: string): Promise<HeroBanner | null> => {
    const source = banners.value.find(b => b.id === id)
    if (!source) return null

    const copy: HeroBanner = {
      ...JSON.parse(JSON.stringify(source)),
      id: `banner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      headline: `${source.headline} (Copy)`,
      isActive: false, // Inactive by default until reviewed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    banners.value.unshift(copy)
    await saveBannersToCloud()
    return copy
  }

  const reorderBanners = async (orderedIds: string[]): Promise<void> => {
    const idMap = new Map(orderedIds.map((id, index) => [id, index + 1]))
    banners.value.forEach(b => {
      if (idMap.has(b.id)) {
        b.sortOrder = idMap.get(b.id)!
      }
    })
    banners.value.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    await saveBannersToCloud()
  }

  const resetBannersToDefaults = async (): Promise<void> => {
    banners.value = JSON.parse(JSON.stringify(defaultBanners))
    await saveBannersToCloud()
  }

  return {
    banners,
    activeBanners,
    isSyncing,
    isSaving,
    isBannerExpired,
    isBannerScheduled,
    isBannerActive,
    saveBanner,
    deleteBanner,
    toggleBannerActive,
    duplicateBanner,
    reorderBanners,
    resetBannersToDefaults,
    syncFromFirestore,
    saveBannersToCloud
  }
}

