import { reactive } from 'vue'

export interface Author {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  twitter: string
  linkedin: string
}

export interface GalleryItem {
  src: string
  alt: string
  credit?: string
  linkUrl?: string
}

export interface ArticleSection {
  id: string
  title: string
  content: string
  image?: {
    src: string
    mobileSrc?: string
    alt: string
    caption: string
    credit?: string
    linkUrl?: string
  }
  video?: {
    src: string
    caption?: string
    credit?: string
    poster?: string
  }
  callout?: {
    type: 'insight' | 'stat' | 'tip'
    title: string
    text: string
  }
  comparisonTable?: {
    headers: string[]
    rows: string[][]
  }
  includeHtml?: boolean
  htmlContent?: string
  gallery?: (string | GalleryItem)[]
  galleryCaption?: string
}

export interface SubCategoryMeta {
  id: string
  name: string
  slug: string
  description?: string
}

export interface CategoryMeta {
  name: string
  slug: string
  description: string
  seoTitle?: string
  metaDescription?: string
  color: string
  badgeBg: string
  icon: string
  image: string
  showInNavbar?: boolean
  subCategories?: SubCategoryMeta[]
}

export type ArticleStatus = 'published' | 'draft'

export interface Article {
  id: string
  slug: string
  title: string
  titleHighlight?: string
  excerpt: string
  seoTitle?: string
  metaDescription?: string
  seoKeywords?: string
  category: string
  categorySlug: string
  subCategory?: string
  subCategorySlug?: string
  categoryColor: string
  featuredImage: string
  bannerImage?: string
  bannerImageMobile?: string
  bannerAlt?: string
  imageCaption: string
  bannerCredit?: string
  bannerLinkUrl?: string
  videoUrl?: string
  videoCaption?: string
  videoCredit?: string
  publishedAt: string
  readTime: string
  views: number
  status?: ArticleStatus // 'published' | 'draft' (default 'published')
  isPublished?: boolean
  isFeatured?: boolean
  isPopular?: boolean
  author: Author
  sections: ArticleSection[]
  galleryItems?: GalleryItem[]
  galleryCaption?: string
  content?: string
  tags: string[]
  updatedAt?: string
}

const LEGACY_DEFAULT_CATEGORY_DESCRIPTIONS = new Set([
  'Breaking developments, global policy analysis, and essential daily reporting.',
  'Breakthrough developments in AI, autonomous agents, computing hardware, and human-machine interaction.',
  'Timeless wardrobe curation, sustainable textiles, modern tailoring, and design culture.',
  'Artisan baking, fermentation science, seasonal culinary techniques, and honest chef-tested recipes.',
  'Architectural craftsmanship, acoustic styling, woodworking, and smart hands-on renovations for modern living.',
  'Evidence-based child development, fostering curiosity, screen balance, and mindful family resilience.'
])

const isLegacyDefaultCategory = (cat: CategoryMeta): boolean => {
  if (!cat) return true
  return LEGACY_DEFAULT_CATEGORY_DESCRIPTIONS.has((cat.description || '').trim())
}

const sharedArticles = reactive<Article[]>([])
const sharedCategories = reactive<CategoryMeta[]>([])
let isInitialized = false
let isCategoriesInitialized = false

export const useArticles = () => {
  const asset = (path: string) => useAsset(path)

  const authors: Record<string, Author> = {
    marcus: {
      id: 'marcus-vance',
      name: 'Dr. Marcus Vance',
      role: 'Principal Technology Analyst & Senior Editor',
      bio: 'Dr. Marcus Vance holds a doctorate in Distributed Systems from Carnegie Mellon. He has covered machine intelligence, autonomous systems, and modern computing architectures for over 15 years.',
      avatar: asset('/images/author-marcus.jpg'),
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    }
  }

  const defaultCategories: CategoryMeta[] = []

  const persistCategories = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hc_cms_custom_categories', JSON.stringify(sharedCategories))
      } catch {
        // Ignore storage errors
      }
      try {
        const { saveFirestoreCategories } = useFirebase()
        saveFirestoreCategories(sharedCategories).catch(() => {})
      } catch {
        // Ignore cloud sync errors
      }
    }
  }

  if (!isCategoriesInitialized) {
    sharedCategories.splice(0, sharedCategories.length, ...defaultCategories)
    if (typeof window !== 'undefined') {
      try {
        const savedCats = localStorage.getItem('hc_cms_custom_categories')
        if (savedCats) {
          const parsedCats: CategoryMeta[] = JSON.parse(savedCats)
          if (Array.isArray(parsedCats)) {
            const userAddedCats = parsedCats.filter(c => !isLegacyDefaultCategory(c))
            sharedCategories.splice(0, sharedCategories.length, ...userAddedCats)
            localStorage.setItem('hc_cms_custom_categories', JSON.stringify(sharedCategories))
          }
        }
      } catch {
        // Ignore storage errors
      }
      isCategoriesInitialized = true
    }
  }

  const categories = sharedCategories

  const defaultArticles: Article[] = []

  const initClientArticles = () => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('hc_cms_custom_articles')
      if (saved) {
        const parsed: Article[] = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleanArticles = parsed
            .filter(a => a.id !== 'art-1' && a.slug !== 'unboxing-2006-full-path-tracing-geforce-8800-gtx')
            .map(a => ({
              ...a,
              views: typeof a.views === 'number' && a.views >= 5000 ? 1 : (a.views || 1)
            }))
          sharedArticles.splice(0, sharedArticles.length, ...cleanArticles)
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  if (typeof window !== 'undefined') {
    initClientArticles()
  } else if (!isInitialized) {
    sharedArticles.splice(0, sharedArticles.length, ...defaultArticles)
    isInitialized = true
  }

  const persistArticles = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hc_cms_custom_articles', JSON.stringify(sharedArticles))
      } catch (e: any) {
        console.warn('[Storage] Warning saving articles to localStorage:', e?.message || e)
        try {
          localStorage.removeItem('hc_saved_article_draft')
          localStorage.setItem('hc_cms_custom_articles', JSON.stringify(sharedArticles))
        } catch {
          // Ignore secondary storage error
        }
      }
    }
  }

  const articles = sharedArticles

  const syncFromFirestore = async () => {
    if (typeof window === 'undefined') return
    try {
      const { fetchFirestoreArticles, saveFirestoreArticle, fetchFirestoreCategories, saveFirestoreCategories } = useFirebase()

      // Sync custom categories
      try {
        const remoteCats = await fetchFirestoreCategories()
        if (remoteCats && Array.isArray(remoteCats)) {
          const filteredRemoteCats = remoteCats.filter((c: CategoryMeta) => !isLegacyDefaultCategory(c))
          sharedCategories.splice(0, sharedCategories.length, ...filteredRemoteCats)
          localStorage.setItem('hc_cms_custom_categories', JSON.stringify(sharedCategories))
          if (filteredRemoteCats.length !== remoteCats.length) {
            await saveFirestoreCategories(sharedCategories).catch(() => {})
          }
        }
      } catch {
        // Ignore category sync errors
      }

      const remote = await fetchFirestoreArticles()
      if (remote && remote.length > 0) {
        // Intelligently merge remote articles with local articles without overwriting newer local edits
        for (const rArt of remote) {
          if (typeof rArt.views === 'number' && rArt.views >= 5000) {
            rArt.views = 1
          }
          const localIdx = sharedArticles.findIndex(a => a.id === rArt.id || a.slug === rArt.slug)
          if (localIdx !== -1) {
            const localArt = sharedArticles[localIdx]
            const localTime = new Date(localArt.updatedAt || localArt.publishedAt || 0).getTime()
            const remoteTime = new Date(rArt.updatedAt || rArt.publishedAt || 0).getTime()

            if (localTime > remoteTime) {
              // Local version is newer (user updated images/content locally); push local state to cloud
              await saveFirestoreArticle(localArt).catch(() => {})
            } else {
              // Remote version is newer or equal; update local state
              sharedArticles.splice(localIdx, 1, { ...localArt, ...rArt })
            }
          } else {
            // New remote article not found locally; add it
            sharedArticles.push(rArt)
          }
        }

        // Push any newly created local articles that don't exist in remote yet
        for (const lArt of sharedArticles) {
          const existsInRemote = remote.some(r => r.id === lArt.id || r.slug === lArt.slug)
          if (!existsInRemote) {
            await saveFirestoreArticle(lArt).catch(() => {})
          }
        }

        persistArticles()
      } else if (remote && remote.length === 0 && sharedArticles.length > 0) {
        // Seed initial articles into Firestore DB "headline-central"
        for (const art of sharedArticles) {
          await saveFirestoreArticle(art).catch(() => {})
        }
      }
    } catch {
      // Ignore if Firestore is offline or unconfigured
    }
  }

  const addArticle = async (newArticle: Article): Promise<Article> => {
    const rawSlug = newArticle.slug || (newArticle.title ? slugifyText(newArticle.title) : '') || `story-${Date.now()}`
    const cleanSlug = normalizeSlug(rawSlug)

    const stampedArticle: Article = {
      ...newArticle,
      slug: cleanSlug,
      updatedAt: newArticle.updatedAt || new Date().toISOString()
    }

    // Instantly update local reactive state
    const existingIdx = sharedArticles.findIndex(a => a.id === stampedArticle.id || normalizeSlug(a.slug) === cleanSlug)
    if (existingIdx !== -1) {
      sharedArticles.splice(existingIdx, 1, stampedArticle)
    } else {
      sharedArticles.unshift(stampedArticle)
    }
    persistArticles()

    // Sync to Firestore in background without blocking UI
    if (typeof window !== 'undefined') {
      const { saveFirestoreArticle } = useFirebase()
      saveFirestoreArticle(stampedArticle).catch(() => {})
    }
    return stampedArticle
  }

  const updateArticle = async (id: string, updated: Partial<Article>): Promise<Article | undefined> => {
    const target = normalizeSlug(id)
    const idx = sharedArticles.findIndex(a => normalizeSlug(a.id) === target || normalizeSlug(a.slug) === target)
    if (idx !== -1) {
      const existing = sharedArticles[idx]
      const rawSlug = updated.slug || (updated.title ? slugifyText(updated.title) : existing.slug)
      const cleanSlug = normalizeSlug(rawSlug)

      const merged: Article = {
        ...existing,
        ...updated,
        slug: cleanSlug,
        updatedAt: new Date().toISOString()
      }
      sharedArticles.splice(idx, 1, merged)
      persistArticles()

      if (typeof window !== 'undefined') {
        const { saveFirestoreArticle } = useFirebase()
        saveFirestoreArticle(merged).catch(() => {})
      }
      return merged
    }
    return undefined
  }

  const deleteArticle = async (id: string) => {
    const target = normalizeSlug(id)
    const idx = sharedArticles.findIndex(a => normalizeSlug(a.id) === target || normalizeSlug(a.slug) === target)
    if (idx !== -1) {
      const removed = sharedArticles.splice(idx, 1)[0]
      persistArticles()
      if (typeof window !== 'undefined') {
        const { deleteFirestoreArticle } = useFirebase()
        deleteFirestoreArticle(removed.id).catch(() => {})
      }
    }
  }

  const normalizeSlug = (s: string): string => {
    if (!s) return ''
    try {
      return decodeURIComponent(s).toLowerCase().trim().replace(/^\/+|\/+$/g, '')
    } catch {
      return s.toLowerCase().trim().replace(/^\/+|\/+$/g, '')
    }
  }

  const slugifyText = (text: string): string => {
    if (!text) return ''
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  const getArticleBySlug = (rawSlug: string): Article | undefined => {
    if (!rawSlug) return undefined
    const target = normalizeSlug(rawSlug)
    if (!target) return undefined

    // 1. Direct match in reactive state
    let match = sharedArticles.find(a => {
      const aSlug = normalizeSlug(a.slug)
      const aId = normalizeSlug(a.id)
      const aTitleSlug = normalizeSlug(slugifyText(a.title))
      return aSlug === target || aId === target || aTitleSlug === target
    })

    if (match) return match

    // 2. Client-side synchronous fallback to localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('hc_cms_custom_articles')
        if (saved) {
          const parsed: Article[] = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            match = parsed.find(a => {
              const aSlug = normalizeSlug(a.slug)
              const aId = normalizeSlug(a.id)
              const aTitleSlug = normalizeSlug(slugifyText(a.title))
              return aSlug === target || aId === target || aTitleSlug === target
            })
            if (match) {
              const exists = sharedArticles.some(a => a.id === match!.id || normalizeSlug(a.slug) === normalizeSlug(match!.slug))
              if (!exists) {
                sharedArticles.unshift(match)
              }
              return match
            }
          }
        }
      } catch {
        // Ignore fallback storage parse errors
      }
    }

    return undefined
  }

  const getArticlesByCategory = (categorySlug: string) => {
    return articles.filter(a => a.categorySlug === categorySlug && a.status !== 'draft')
  }

  const getPopularArticles = (): Article[] => {
    const published = articles.filter(a => a.status !== 'draft')
    const popular = published.filter(a => a.isPopular).sort((a, b) => (b.views || 0) - (a.views || 0))
    if (popular.length > 0) return popular
    return [...published].sort((a, b) => (b.views || 0) - (a.views || 0))
  }

  const getFeaturedArticle = (): Article | undefined => {
    const published = articles.filter(a => a.status !== 'draft')
    return published.find(a => a.isFeatured) || published[0] || undefined
  }

  const getLatestArticles = (limit = 6) => {
    const published = articles.filter(a => a.status !== 'draft')
    return [...published].slice(0, limit)
  }

  const toggleArticleStatus = async (id: string): Promise<Article | undefined> => {
    const art = sharedArticles.find(a => a.id === id || a.slug === id)
    if (!art) return undefined
    const isCurrentlyDraft = art.status === 'draft'
    const newStatus: ArticleStatus = isCurrentlyDraft ? 'published' : 'draft'
    return updateArticle(art.id, {
      status: newStatus,
      isPublished: newStatus === 'published'
    })
  }

  const getCategoryMeta = (slug: string): CategoryMeta | undefined => {
    return categories.find(c => c.slug === slug)
  }

  const addCategory = (cat: Omit<CategoryMeta, 'color' | 'badgeBg' | 'icon'> & Partial<Pick<CategoryMeta, 'color' | 'badgeBg' | 'icon'>>) => {
    const existing = categories.find(c => c.slug === cat.slug)
    if (existing) return existing
    const newCat: CategoryMeta = {
      name: cat.name.trim(),
      slug: cat.slug.trim().toLowerCase(),
      description: cat.description.trim() || `Stories and analysis in ${cat.name.trim()}.`,
      color: cat.color || '#ee5102',
      badgeBg: cat.badgeBg || 'bg-yberry-100 text-yberry-1000 border border-yberry-300',
      icon: cat.icon || 'Sparkles',
      image: cat.image || asset('/images/tech-hero.jpg'),
      showInNavbar: cat.showInNavbar !== false,
      subCategories: Array.isArray(cat.subCategories) ? cat.subCategories : []
    }
    sharedCategories.push(newCat)
    persistCategories()
    return newCat
  }

  const updateCategory = (slug: string, updates: Partial<CategoryMeta>) => {
    const idx = sharedCategories.findIndex(c => c.slug === slug)
    if (idx !== -1) {
      sharedCategories[idx] = {
        ...sharedCategories[idx],
        ...updates
      }
      persistCategories()
      return sharedCategories[idx]
    }
    return undefined
  }

  const deleteCategory = (slug: string) => {
    const idx = sharedCategories.findIndex(c => c.slug === slug)
    if (idx !== -1) {
      sharedCategories.splice(idx, 1)
      persistCategories()
      return true
    }
    return false
  }

  const addSubCategory = (categorySlug: string, subName: string, subSlug?: string, description?: string) => {
    const cat = sharedCategories.find(c => c.slug === categorySlug)
    if (!cat) return undefined
    if (!cat.subCategories) {
      cat.subCategories = []
    }
    const cleanName = subName.trim()
    const cleanSlug = (subSlug || cleanName)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')

    const exists = cat.subCategories.find(s => s.slug === cleanSlug)
    if (exists) return exists

    const newSub: SubCategoryMeta = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: cleanName,
      slug: cleanSlug,
      description: description?.trim()
    }
    cat.subCategories.push(newSub)
    persistCategories()
    return newSub
  }

  const removeSubCategory = (categorySlug: string, subIdOrSlug: string) => {
    const cat = sharedCategories.find(c => c.slug === categorySlug)
    if (!cat || !cat.subCategories) return false
    const idx = cat.subCategories.findIndex(s => s.id === subIdOrSlug || s.slug === subIdOrSlug)
    if (idx !== -1) {
      cat.subCategories.splice(idx, 1)
      persistCategories()
      return true
    }
    return false
  }

  return {
    authors,
    categories,
    articles,
    syncFromFirestore,
    addArticle,
    updateArticle,
    deleteArticle,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    removeSubCategory,
    getArticleBySlug,
    getArticlesByCategory,
    getPopularArticles,
    getFeaturedArticle,
    getLatestArticles,
    getCategoryMeta,
    toggleArticleStatus
  }
}

