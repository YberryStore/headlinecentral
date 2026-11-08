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
  publishedAt: string
  readTime: string
  views: number
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

  const defaultCategories: CategoryMeta[] = [
    {
      name: 'News',
      slug: 'news',
      description: 'Breaking developments, global policy analysis, and essential daily reporting.',
      color: '#ee5102',
      badgeBg: 'bg-yberry-100 text-yberry-1000 border border-yberry-300',
      icon: 'Newspaper',
      image: asset('/images/tech-hero.jpg'),
      showInNavbar: true,
      subCategories: [
        { id: 'sub-news-1', name: 'Global Policy', slug: 'global-policy' },
        { id: 'sub-news-2', name: 'Industry Briefings', slug: 'industry-briefings' }
      ]
    },
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Breakthrough developments in AI, autonomous agents, computing hardware, and human-machine interaction.',
      color: '#ee5102',
      badgeBg: 'bg-yberry-100 text-yberry-1000 border border-yberry-300',
      icon: 'Cpu',
      image: asset('/images/tech-hero.jpg'),
      showInNavbar: true,
      subCategories: [
        { id: 'sub-tech-1', name: 'GPUs & Hardware', slug: 'gpus-and-hardware' },
        { id: 'sub-tech-2', name: 'AI & Architecture', slug: 'ai-and-architecture' },
        { id: 'sub-tech-3', name: 'Retro Tech', slug: 'retro-tech' }
      ]
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Timeless wardrobe curation, sustainable textiles, modern tailoring, and design culture.',
      color: '#ee5102',
      badgeBg: 'bg-yberry-100 text-yberry-1000 border border-yberry-300',
      icon: 'Sparkles',
      image: asset('/images/diy-hero.jpg'),
      showInNavbar: true,
      subCategories: [
        { id: 'sub-fashion-1', name: 'Sustainable Style', slug: 'sustainable-style' },
        { id: 'sub-fashion-2', name: 'Design Culture', slug: 'design-culture' }
      ]
    },
    {
      name: 'Food',
      slug: 'food',
      description: 'Artisan baking, fermentation science, seasonal culinary techniques, and honest chef-tested recipes.',
      color: '#f0631c',
      badgeBg: 'bg-orange-50 text-orange-900 border border-orange-200',
      icon: 'Utensils',
      image: asset('/images/food-hero.jpg'),
      showInNavbar: true,
      subCategories: [
        { id: 'sub-food-1', name: 'Artisan Baking', slug: 'artisan-baking' },
        { id: 'sub-food-2', name: 'Seasonal Recipes', slug: 'seasonal-recipes' }
      ]
    },
    {
      name: 'Home and DIY',
      slug: 'home-and-diy',
      description: 'Architectural craftsmanship, acoustic styling, woodworking, and smart hands-on renovations for modern living.',
      color: '#f17435',
      badgeBg: 'bg-amber-50 text-amber-900 border border-amber-200',
      icon: 'Home',
      image: asset('/images/diy-hero.jpg'),
      showInNavbar: true,
      subCategories: [
        { id: 'sub-diy-1', name: 'Woodworking & Craft', slug: 'woodworking-and-craft' },
        { id: 'sub-diy-2', name: 'Smart Renovations', slug: 'smart-renovations' }
      ]
    },
    {
      name: 'Parenting',
      slug: 'parenting',
      description: 'Evidence-based child development, fostering curiosity, screen balance, and mindful family resilience.',
      color: '#e88b6b',
      badgeBg: 'bg-rose-50 text-rose-900 border border-rose-200',
      icon: 'HeartHandshake',
      image: asset('/images/parenting-hero.jpg'),
      showInNavbar: true,
      subCategories: [
        { id: 'sub-parenting-1', name: 'Child Development', slug: 'child-development' },
        { id: 'sub-parenting-2', name: 'Digital Balance', slug: 'digital-balance' }
      ]
    }
  ]

  if (!isCategoriesInitialized) {
    sharedCategories.splice(0, sharedCategories.length, ...defaultCategories)
    if (typeof window !== 'undefined') {
      try {
        const savedCats = localStorage.getItem('hc_cms_custom_categories')
        if (savedCats) {
          const parsedCats: CategoryMeta[] = JSON.parse(savedCats)
          if (Array.isArray(parsedCats) && parsedCats.length > 0) {
            sharedCategories.splice(0, sharedCategories.length, ...parsedCats)
          }
        }
      } catch {
        // Ignore storage errors
      }
    }
    isCategoriesInitialized = true
  }

  const persistCategories = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hc_cms_custom_categories', JSON.stringify(sharedCategories))
      } catch {
        // Ignore storage errors
      }
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
          const cleanArticles = parsed.filter(a => a.id !== 'art-1' && a.slug !== 'unboxing-2006-full-path-tracing-geforce-8800-gtx')
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
      const { fetchFirestoreArticles, saveFirestoreArticle } = useFirebase()
      const remote = await fetchFirestoreArticles()
      if (remote && remote.length > 0) {
        // Intelligently merge remote articles with local articles without overwriting newer local edits
        for (const rArt of remote) {
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
    const stampedArticle: Article = {
      ...newArticle,
      updatedAt: newArticle.updatedAt || new Date().toISOString()
    }
    sharedArticles.unshift(stampedArticle)
    persistArticles()
    if (typeof window !== 'undefined') {
      const { saveFirestoreArticle } = useFirebase()
      await saveFirestoreArticle(stampedArticle).catch(() => {})
    }
    return stampedArticle
  }

  const updateArticle = async (id: string, updated: Partial<Article>): Promise<Article | undefined> => {
    const idx = sharedArticles.findIndex(a => a.id === id || a.slug === id)
    if (idx !== -1) {
      const merged: Article = {
        ...sharedArticles[idx],
        ...updated,
        updatedAt: new Date().toISOString()
      }
      sharedArticles.splice(idx, 1, merged)
      persistArticles()
      if (typeof window !== 'undefined') {
        const { saveFirestoreArticle } = useFirebase()
        await saveFirestoreArticle(merged).catch(() => {})
      }
      return merged
    }
    return undefined
  }

  const deleteArticle = async (id: string) => {
    const idx = sharedArticles.findIndex(a => a.id === id || a.slug === id)
    if (idx !== -1) {
      sharedArticles.splice(idx, 1)
      persistArticles()
      if (typeof window !== 'undefined') {
        const { deleteFirestoreArticle } = useFirebase()
        await deleteFirestoreArticle(id).catch(() => {})
      }
    }
  }

  const getArticleBySlug = (slug: string): Article | undefined => {
    if (!slug) return undefined
    return articles.find(a => a.slug === slug || a.id === slug)
  }

  const getArticlesByCategory = (categorySlug: string) => {
    return articles.filter(a => a.categorySlug === categorySlug)
  }

  const getPopularArticles = (): Article[] => {
    const popular = articles.filter(a => a.isPopular).sort((a, b) => (b.views || 0) - (a.views || 0))
    if (popular.length > 0) return popular
    return [...articles].sort((a, b) => (b.views || 0) - (a.views || 0))
  }

  const getFeaturedArticle = (): Article | undefined => {
    return articles.find(a => a.isFeatured) || articles[0] || undefined
  }

  const getLatestArticles = (limit = 6) => {
    return [...articles].slice(0, limit)
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
    if (idx !== -1 && sharedCategories.length > 1) {
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
    getCategoryMeta
  }
}

