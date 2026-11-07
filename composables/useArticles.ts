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

export interface Article {
  id: string
  slug: string
  title: string
  titleHighlight?: string
  excerpt: string
  category: 'Technology' | 'Home and DIY' | 'Food' | 'Parenting'
  categorySlug: 'technology' | 'home-and-diy' | 'food' | 'parenting'
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
let isInitialized = false

export interface CategoryMeta {
  name: string
  slug: 'technology' | 'home-and-diy' | 'food' | 'parenting' | 'fashion' | 'news'
  description: string
  color: string
  badgeBg: string
  icon: string
  image: string
}

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

  const categories: CategoryMeta[] = [
    {
      name: 'Technology',
      slug: 'technology',
      description: 'Breakthrough developments in AI, autonomous agents, computing hardware, and human-machine interaction.',
      color: '#ee5102',
      badgeBg: 'bg-yberry-100 text-yberry-1000 border border-yberry-300',
      icon: 'Cpu',
      image: asset('/images/tech-hero.jpg')
    },
    {
      name: 'Home and DIY',
      slug: 'home-and-diy',
      description: 'Architectural craftsmanship, acoustic styling, woodworking, and smart hands-on renovations for modern living.',
      color: '#f17435',
      badgeBg: 'bg-amber-50 text-amber-900 border border-amber-200',
      icon: 'Home',
      image: asset('/images/diy-hero.jpg')
    },
    {
      name: 'Food',
      slug: 'food',
      description: 'Artisan baking, fermentation science, seasonal culinary techniques, and honest chef-tested recipes.',
      color: '#f0631c',
      badgeBg: 'bg-orange-50 text-orange-900 border border-orange-200',
      icon: 'Utensils',
      image: asset('/images/food-hero.jpg')
    },
    {
      name: 'Parenting',
      slug: 'parenting',
      description: 'Evidence-based child development, fostering curiosity, screen balance, and mindful family resilience.',
      color: '#e88b6b',
      badgeBg: 'bg-rose-50 text-rose-900 border border-rose-200',
      icon: 'HeartHandshake',
      image: asset('/images/parenting-hero.jpg')
    }
  ]

  const defaultArticles: Article[] = [
    {
      id: 'art-1',
      slug: 'unboxing-2006-full-path-tracing-geforce-8800-gtx',
      title: 'Unboxing 2006 in Full Path Tracing: Revisiting the GeForce 8800 GTX Two Decades On',
      titleHighlight: 'Unboxing 2006',
      excerpt: 'Software is no longer just a passive tool waiting for human input. We examine how multimodal agent architectures and proactive intelligence are quietly',
      category: 'Technology',
      categorySlug: 'technology',
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

  const addArticle = (newArticle: Article) => {
    sharedArticles.unshift(newArticle)
    persistArticles()
  }

  const updateArticle = (id: string, updated: Partial<Article>) => {
    const idx = sharedArticles.findIndex(a => a.id === id)
    if (idx !== -1) {
      sharedArticles[idx] = { ...sharedArticles[idx], ...updated }
      persistArticles()
    }
  }

  const deleteArticle = (id: string) => {
    const idx = sharedArticles.findIndex(a => a.id === id)
    if (idx !== -1) {
      sharedArticles.splice(idx, 1)
      persistArticles()
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
    const found = categories.find(c => c.slug === slug)
    if (found) return found
    if (slug === 'fashion') {
      return {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Timeless wardrobe curation, sustainable textiles, modern tailoring, and design culture.',
        color: '#ee5102',
        badgeBg: 'bg-yberry-100 text-yberry-1000 border border-yberry-300',
        icon: 'Sparkles',
        image: '/images/diy-hero.jpg'
      }
    }
    if (slug === 'news') {
      return {
        name: 'News',
        slug: 'news',
        description: 'Breaking developments, global policy analysis, and essential daily reporting.',
        color: '#ee5102',
        badgeBg: 'bg-yberry-100 text-yberry-1000 border border-yberry-300',
        icon: 'Newspaper',
        image: '/images/tech-hero.jpg'
      }
    }
    return undefined
  }

  return {
    authors,
    categories,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticleBySlug,
    getArticlesByCategory,
    getPopularArticles,
    getFeaturedArticle,
    getLatestArticles,
    getCategoryMeta
  }
}

