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

  const defaultArticles: Article[] = [
    {
      id: 'art-1',
      slug: 'unboxing-2006-full-path-tracing-geforce-8800-gtx',
      title: 'Unboxing 2006 in Full Path Tracing: Revisiting the GeForce 8800 GTX Two Decades On',
      titleHighlight: 'Unboxing 2006',
      excerpt: 'Software is no longer just a passive tool waiting for human input. We examine how multimodal agent architectures and proactive intelligence are quietly',
      category: 'Technology',
      categorySlug: 'technology',
      subCategory: 'GPUs & Hardware',
      subCategorySlug: 'gpus-and-hardware',
      categoryColor: '#ee5102',
      featuredImage: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp'),
      bannerImage: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-desktop-banner.webp'),
      bannerImageMobile: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp'),
      bannerAlt: 'Unboxing 2006 in Full Path Tracing: NVIDIA GeForce 8800 GTX Hero Banner',
      imageCaption: 'Photo courtesy: NVIDIA G80 20-Year Archive Celebration • Captured in 4K Path Tracing',
      publishedAt: '2026 November 7',
      readTime: '5 min read',
      views: 52400,
      isFeatured: true,
      isPopular: true,
      author: authors.marcus,
      tags: ['NVIDIA', 'GeForce 8800', 'Retro Tech', 'Hardware', 'PC Gaming History'],
      sections: [
        {
          id: 'standing-in-awe-2006-memory',
          title: 'Standing in Awe: A 2006 Memory',
          content: `Back in 2006, the release of the GeForce 8800 GTX was a genuine seismic shockwave. Full programmable shaders, unified lighting, dynamic shadows that didn't stutter, and a heat-sink assembly that felt like heavy industrial art.\n\nFrom the moment you opened the box, this card didn't just feel like an iterative speed bump. It felt like an alien artifact delivered from five years in the future. The sheer architectural confidence was unmistakable: gone were dedicated pixel and vertex pipelines, replaced by unified stream processors that could pivot between rendering physics, geometry, and high-precision lighting shaders on demand.\n\nThe physical presence of the card left an indelible impression. The heavy glossy shroud, the dual PCIe auxiliary power connectors, and that iconic green-and-black eye graphic promised an unprecedented realm of immersion in Crysis and Oblivion.\n\nIn an era where 1280x1024 was standard resolution and 1600x1200 felt like the absolute bleeding edge, the 8800 GTX delivered something that modern gamers take for granted: smooth, uncompromising performance at settings that humbled every other chip on the market. It didn't merely play games; it redefined expectations for what interactive 3D worlds could look like.\n\nA revelation of power, where other systems struggled and stuttered to keep up with demanding shader models, the 8800 GTX stood alone. For hardware enthusiasts who lived through that winter of 2006, it remains the gold standard for what a generational performance leap should look like: unmistakable, audacious, and permanently memorable.\n\nTwenty years later, with path tracing and neural reconstruction becoming the modern baseline, revisiting the 8800 GTX offers a fascinating lens on where modern GPUs began. What was once the pinnacle of brute-force rasterization now serves as the spiritual progenitor to everything from ray-tracing cores to autonomous computing clusters.`
        },
        {
          id: 'rebuilding-the-dream-steam-tech-demo',
          title: 'Rebuilding the Dream: The 20-Year Steam Tech Demo',
          content: `To commemorate twenty years of G80, enthusiasts and graphics engineers reconstructed the iconic 2006 demo scene using fully path-traced rendering pipelines, pushing modern hardware while honoring the visual language of the original release.\n\nRevisiting the original 2006 demo on contemporary silicon reveals how ahead of its time the architectural concept really was. By routing every pipeline through unified compute blocks, the modern recreation demonstrates dynamic bounce lighting, volumetric vapor dispersion, and photorealistic silicon reflections that the original engineers envisioned twenty years ago.`,
          image: {
            src: asset('/images/geforce-8800-gtx-gpu-celebration-20-year-steam-tech-demo.webp'),
            mobileSrc: asset('/images/geforce-8800-gtx-gpu-celebration-20-year-steam-tech-demo.webp'),
            alt: 'GeForce 8800 GTX 20 Years of a Legend',
            caption: '20 Years of a Legend: Reconstructing the vintage GeForce 8800 GTX tech demo with modern real-time lighting.'
          }
        },
        {
          id: 'modern-tech-meets-vintage-silicon',
          title: 'Modern Tech Meets Vintage Silicon',
          content: `How does the silicon of 2006 compare to modern workstation GPUs? While clock speeds and memory bandwidth have scaled by orders of magnitude, the fundamental conceptual shift introduced by G80—general-purpose parallel computation—remains the foundation of modern high-performance computing.\n\nBelow is an architectural breakdown highlighting the generational leap from the original G80 milestone to current-generation 2026 neural architectures:`,
          includeHtml: true,
          htmlContent: `<div class="my-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse text-xs sm:text-sm">
      <thead>
        <tr class="bg-[#EE5102] text-white">
          <th class="py-3.5 px-4 sm:px-5 font-semibold text-xs tracking-wider">Component / Feature</th>
          <th class="py-3.5 px-4 sm:px-5 font-semibold text-xs tracking-wider">GeForce 8800 GTX (2006)</th>
          <th class="py-3.5 px-4 sm:px-5 font-semibold text-xs tracking-wider">Modern Architecture (2026 Target)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 bg-white">
        <tr class="bg-white hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Unified Architecture</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">128 Stream Processors</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">Thousands of Parallel Cores + Dedicated RT &amp; Tensor Cores</td>
        </tr>
        <tr class="bg-orange-50/20 hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Core Clock &amp; Memory</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">575 MHz Core / 768 MB GDDR3 (384-bit)</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">2.5+ GHz Core / 24+ GB High-Bandwidth GDDR6X / HBM3</td>
        </tr>
        <tr class="bg-white hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">3D Graphics API</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">DirectX 10 Shader Model 4.0</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">DirectX 12 Ultimate / Full Hardware Path Tracing</td>
        </tr>
        <tr class="bg-orange-50/20 hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Architecture Paradigm</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">First Unified Computing Architecture (G80)</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">Neural, Agentic &amp; Autonomous Acceleration</td>
        </tr>
        <tr class="bg-white hover:bg-orange-50/40 transition-colors">
          <td class="py-3.5 px-4 sm:px-5 font-medium text-gray-900 border-r border-gray-100">Historical Market Impact</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700 border-r border-gray-100">First Consumer GPU to Break 500 GFLOPs</td>
          <td class="py-3.5 px-4 sm:px-5 text-gray-700">PetaFLOP Workstation Workhorses Powering Real-Time AI</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`,
          comparisonTable: {
            headers: ['Component / Feature', 'GeForce 8800 GTX (2006)', 'Modern Architecture (2026 Target)'],
            rows: [
              ['Unified Architecture', '128 Stream Processors', 'Thousands of Parallel Cores + Dedicated RT & Tensor Cores'],
              ['Core Clock & Memory', '575 MHz Core / 768 MB GDDR3 (384-bit)', '2.5+ GHz Core / 24+ GB High-Bandwidth GDDR6X / HBM3'],
              ['3D Graphics API', 'DirectX 10 Shader Model 4.0', 'DirectX 12 Ultimate / Full Hardware Path Tracing'],
              ['Architecture Paradigm', 'First Unified Computing Architecture (G80)', 'Neural, Agentic & Autonomous Acceleration'],
              ['Historical Market Impact', 'First Consumer GPU to Break 500 GFLOPs', 'PetaFLOP Workstation Workhorses Powering Real-Time AI']
            ]
          }
        },
        {
          id: 'enduring-legacy-of-g80',
          title: 'The Enduring Legacy of the G80',
          content: `Looking back, the GeForce 8800 GTX did something far more profound than win a single hardware cycle. It unlocked CUDA, paved the road for general-purpose GPU computing, and proved that programmable parallel pipelines could tackle challenges far beyond polygon rasterization.\n\nWhether in autonomous AI clusters or the latest generation of real-time photorealistic path tracing, every single frame rendered today owes a debt to the ambitious silicon gamble taken two decades ago. Explore the high-resolution hardware archive below:`,
          gallery: [
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp'), alt: 'GeForce 8800 GTX unboxing overhead view on vintage 2006 desk' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-2.webp'), alt: 'GeForce 8800 GTX full path-traced desktop workstation scene' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-3.webp'), alt: 'GeForce 8800 GTX PCIe power connectors and cooling shroud detail' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-4.webp'), alt: 'Vintage PC case installation with GeForce 8800 GTX' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-5.webp'), alt: 'GeForce 8800 GTX retail box and retro game collection' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-6.webp'), alt: 'G80 silicon die and heatsink engineering close-up' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-7.webp'), alt: 'Path-traced lighting reflections on the GeForce 8800 GTX fan housing' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-8.webp'), alt: 'Retro 2006 gaming bedroom setup rendered in RTX Remix' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-9.webp'), alt: 'GeForce 8800 GTX dual-slot bracket and DVI outputs' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-10.webp'), alt: 'NVIDIA SLI bridge and 8800 GTX collector edition box' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-11.webp'), alt: '20-year celebration Steam tech demo interactive desk objects' },
            { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-12.webp'), alt: 'GeForce 8800 GTX commemorative hardware showcase' }
          ],
          galleryCaption: 'A high-resolution visual archive celebrating 20 years of GeForce 8800 GTX hardware craft and industrial design.'
        }
      ],
      galleryItems: [
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-1.webp'), alt: 'GeForce 8800 GTX unboxing overhead view on vintage 2006 desk' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-2.webp'), alt: 'GeForce 8800 GTX full path-traced desktop workstation scene' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-3.webp'), alt: 'GeForce 8800 GTX PCIe power connectors and cooling shroud detail' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-4.webp'), alt: 'Vintage PC case installation with GeForce 8800 GTX' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-5.webp'), alt: 'GeForce 8800 GTX retail box and retro game collection' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-6.webp'), alt: 'G80 silicon die and heatsink engineering close-up' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-7.webp'), alt: 'Path-traced lighting reflections on the GeForce 8800 GTX fan housing' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-8.webp'), alt: 'Retro 2006 gaming bedroom setup rendered in RTX Remix' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-9.webp'), alt: 'GeForce 8800 GTX dual-slot bracket and DVI outputs' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-10.webp'), alt: 'NVIDIA SLI bridge and 8800 GTX collector edition box' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-11.webp'), alt: '20-year celebration Steam tech demo interactive desk objects' },
        { src: asset('/images/geforce-8800-gtx-gpu-celebration-20-years-of-gaming-and-cuda-gallery-12.webp'), alt: 'GeForce 8800 GTX commemorative hardware showcase' }
      ],
      galleryCaption: 'A high-resolution visual archive celebrating 20 years of GeForce 8800 GTX hardware craft and industrial design.'
    }
  ]

  if (!isInitialized) {
    sharedArticles.splice(0, sharedArticles.length, ...defaultArticles)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('hc_cms_custom_articles')
        if (saved) {
          const parsed: Article[] = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            sharedArticles.splice(0, sharedArticles.length, ...parsed)
          }
        }
      } catch (e) {
        // Ignore storage errors
      }
    }
    isInitialized = true
  }

  const persistArticles = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hc_cms_custom_articles', JSON.stringify(sharedArticles))
      } catch (e) {
        // Ignore storage errors
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
        sharedArticles.splice(0, sharedArticles.length, ...remote)
        persistArticles()
      } else if (remote && remote.length === 0 && sharedArticles.length > 0) {
        // Seed initial article into Firestore DB "headline-central"
        await saveFirestoreArticle(sharedArticles[0])
      }
    } catch {
      // Ignore if Firestore is offline or unconfigured
    }
  }

  const addArticle = async (newArticle: Article) => {
    sharedArticles.unshift(newArticle)
    persistArticles()
    if (typeof window !== 'undefined') {
      const { saveFirestoreArticle } = useFirebase()
      await saveFirestoreArticle(newArticle)
    }
  }

  const updateArticle = async (id: string, updated: Partial<Article>) => {
    const idx = sharedArticles.findIndex(a => a.id === id)
    if (idx !== -1) {
      sharedArticles[idx] = { ...sharedArticles[idx], ...updated }
      persistArticles()
      if (typeof window !== 'undefined') {
        const { saveFirestoreArticle } = useFirebase()
        await saveFirestoreArticle(sharedArticles[idx])
      }
    }
  }

  const deleteArticle = async (id: string) => {
    const idx = sharedArticles.findIndex(a => a.id === id)
    if (idx !== -1) {
      sharedArticles.splice(idx, 1)
      persistArticles()
      if (typeof window !== 'undefined') {
        const { deleteFirestoreArticle } = useFirebase()
        await deleteFirestoreArticle(id)
      }
    }
  }

  const getArticleBySlug = (slug: string) => {
    if (slug === 'autonomous-systems-agentic-workflows-2026' || slug === 'unboxing-2006-full-path-tracing-geforce-8800-gtx') {
      return articles.find(a => a.slug === 'autonomous-systems-agentic-workflows-2026' || a.slug === 'unboxing-2006-full-path-tracing-geforce-8800-gtx') || articles[0]
    }
    return articles.find(a => a.slug === slug)
  }

  const getArticlesByCategory = (categorySlug: string) => {
    return articles.filter(a => a.categorySlug === categorySlug)
  }

  const getPopularArticles = () => {
    return articles.filter(a => a.isPopular).sort((a, b) => b.views - a.views)
  }

  const getFeaturedArticle = () => {
    return articles.find(a => a.isFeatured) || articles[0]
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

