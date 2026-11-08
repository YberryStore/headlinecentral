import { reactive, ref, computed } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useFirebase } from '~/composables/useFirebase'

export interface NavMenuItem {
  id: string
  label: string
  to: string
  isVisible: boolean
  isExternal?: boolean
  subCategories?: { id: string; name: string; slug: string }[]
}

export interface HeaderFooterConfig {
  trendingBar: {
    isVisible: boolean
    label: string
    text: string
    link: string
  }
  headerCta: {
    isVisible: boolean
    label: string
    to: string
  }
  navItems: NavMenuItem[]
  footer: {
    brandDescription: string
    copyright: string
    contactEmail: string
    contactPhone: string
    contactAddress: string
    socialLinks: {
      twitter: string
      linkedin: string
      github: string
      facebook: string
      instagram: string
      rss: string
    }
    editorialLinks: { label: string; to: string }[]
    legalLinks: { label: string; to: string }[]
  }
}

export interface ContactPageConfig {
  badge: string
  title: string
  description: string
  pitchesEmail: string
  correctionsEmail: string
  advertisingEmail: string
  generalEmail: string
  phone: string
  address: string
  responseTitle: string
  responseCommitment: string
  responseTime: string
  formEnabled: boolean
  successMessage: string
  inquiryTopics: string[]
}

const HEADER_FOOTER_STORAGE_KEY = 'hc_cms_header_footer_config'
const CONTACT_PAGE_STORAGE_KEY = 'hc_cms_contact_page_config'

const defaultHeaderFooterConfig: HeaderFooterConfig = {
  trendingBar: {
    isVisible: true,
    label: 'Trending now:',
    text: 'Welcome to Headline Central — Essential Stories & Investigative Digital Journalism.',
    link: '/blog'
  },
  headerCta: {
    isVisible: true,
    label: 'Contact Us',
    to: '/contact'
  },
  navItems: [
    {
      id: 'nav-news',
      label: 'News',
      to: '/blog',
      isVisible: true,
      subCategories: [
        { id: 'sub-news-1', name: 'Global Policy', slug: 'global-policy' },
        { id: 'sub-news-2', name: 'Industry Briefings', slug: 'industry-briefings' }
      ]
    },
    {
      id: 'nav-tech',
      label: 'Tech',
      to: '/categories/technology',
      isVisible: true,
      subCategories: [
        { id: 'sub-tech-1', name: 'GPUs & Hardware', slug: 'gpus-and-hardware' },
        { id: 'sub-tech-2', name: 'AI & Architecture', slug: 'ai-and-architecture' },
        { id: 'sub-tech-3', name: 'Retro Tech', slug: 'retro-tech' }
      ]
    },
    {
      id: 'nav-fashion',
      label: 'Fashion',
      to: '/categories/fashion',
      isVisible: true,
      subCategories: [
        { id: 'sub-fashion-1', name: 'Sustainable Style', slug: 'sustainable-style' },
        { id: 'sub-fashion-2', name: 'Design Culture', slug: 'design-culture' }
      ]
    },
    {
      id: 'nav-food',
      label: 'Food',
      to: '/categories/food',
      isVisible: true,
      subCategories: [
        { id: 'sub-food-1', name: 'Artisan Baking', slug: 'artisan-baking' },
        { id: 'sub-food-2', name: 'Seasonal Recipes', slug: 'seasonal-recipes' }
      ]
    },
    {
      id: 'nav-home',
      label: 'Home & DIY',
      to: '/categories/home-and-diy',
      isVisible: true,
      subCategories: [
        { id: 'sub-diy-1', name: 'Woodworking & Craft', slug: 'woodworking-and-craft' },
        { id: 'sub-diy-2', name: 'Smart Renovations', slug: 'smart-renovations' }
      ]
    },
    {
      id: 'nav-parenting',
      label: 'Parenting',
      to: '/categories/parenting',
      isVisible: true,
      subCategories: [
        { id: 'sub-parenting-1', name: 'Child Development', slug: 'child-development' },
        { id: 'sub-parenting-2', name: 'Digital Balance', slug: 'digital-balance' }
      ]
    },
    {
      id: 'nav-about',
      label: 'About',
      to: '/about',
      isVisible: true
    }
  ],
  footer: {
    brandDescription: 'Essential long-form journalism, rigorous analysis, and practical craft guides across News, Tech, Fashion, Food, Home & DIY, and Mindful Parenting.',
    copyright: '© 2026 Headline Central. All rights reserved.',
    contactEmail: 'contact@headlinecentral.co.za',
    contactPhone: '+27 11 000 0000',
    contactAddress: 'Sandton City, Johannesburg, South Africa',
    socialLinks: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      facebook: '',
      instagram: '',
      rss: '/rss.xml'
    },
    editorialLinks: [
      { label: 'About Us', to: '/about' },
      { label: 'Editorial Standards', to: '/about#mission' },
      { label: 'Our Writers', to: '/about#team' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Press & Inquiries', to: '/contact#press' }
    ],
    legalLinks: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Advertising Disclosure', to: '/privacy#advertising' },
      { label: 'Cookie Preferences', to: '/privacy#cookies' }
    ]
  }
}

const defaultContactPageConfig: ContactPageConfig = {
  badge: 'Get in Touch',
  title: 'Contact the Newsroom',
  description: 'Whether you have an investigative tip, a partnership proposal, or a factual correction, we are eager to hear from you.',
  pitchesEmail: 'pitches@headlinecentral.co.za',
  correctionsEmail: 'corrections@headlinecentral.co.za',
  advertisingEmail: 'advertising@headlinecentral.co.za',
  generalEmail: 'info@headlinecentral.co.za',
  phone: '+27 11 000 0000',
  address: 'Sandton City, Johannesburg, South Africa',
  responseTitle: 'Response Commitment',
  responseCommitment: 'We read every email. If submitting a breaking news tip with supporting documentation, please specify confidentiality requirements in your subject line.',
  responseTime: '24 to 48 hours',
  formEnabled: true,
  successMessage: 'Thank you. Your message has been routed to our managing editors. We will respond within 24 to 48 hours.',
  inquiryTopics: [
    'Story Pitch / News Tip',
    'Factual Correction / Feedback',
    'Advertising & Sponsorship',
    'Licensing & Syndication',
    'General Inquiry'
  ]
}

const sharedHeaderFooter = reactive<HeaderFooterConfig>(JSON.parse(JSON.stringify(defaultHeaderFooterConfig)))
const sharedContactPage = reactive<ContactPageConfig>(JSON.parse(JSON.stringify(defaultContactPageConfig)))

let isSiteContentInitialized = false

export const useSiteContent = () => {
  const isSaving = ref(false)

  const initSiteContent = () => {
    if (isSiteContentInitialized) return

    if (typeof window !== 'undefined') {
      try {
        const storedHf = localStorage.getItem(HEADER_FOOTER_STORAGE_KEY)
        if (storedHf) {
          const parsed = JSON.parse(storedHf)
          Object.assign(sharedHeaderFooter, parsed)
        }
        const storedContact = localStorage.getItem(CONTACT_PAGE_STORAGE_KEY)
        if (storedContact) {
          const parsed = JSON.parse(storedContact)
          Object.assign(sharedContactPage, parsed)
        }
      } catch (err) {
        console.warn('[Site Content] Error loading saved settings:', err)
      }
    }

    isSiteContentInitialized = true
  }

  initSiteContent()

  const syncSiteContentFromCloud = async () => {
    if (typeof window === 'undefined') return
    try {
      const { initFirebase } = useFirebase()
      initFirebase()
      // @ts-ignore
      const db = (window as any).__hc_firestore_instance
      if (!db) return

      const hfSnap = await getDoc(doc(db, 'system_settings', 'header_footer'))
      if (hfSnap.exists()) {
        const cloudHf = hfSnap.data() as HeaderFooterConfig
        Object.assign(sharedHeaderFooter, cloudHf)
        try {
          localStorage.setItem(HEADER_FOOTER_STORAGE_KEY, JSON.stringify(sharedHeaderFooter))
        } catch {}
      }

      const contactSnap = await getDoc(doc(db, 'system_settings', 'contact_page'))
      if (contactSnap.exists()) {
        const cloudContact = contactSnap.data() as ContactPageConfig
        Object.assign(sharedContactPage, cloudContact)
        try {
          localStorage.setItem(CONTACT_PAGE_STORAGE_KEY, JSON.stringify(sharedContactPage))
        } catch {}
      }
    } catch (err) {
      console.warn('[Site Content] Cloud sync notice:', err)
    }
  }

  const saveHeaderFooterConfig = async (newConfig?: Partial<HeaderFooterConfig>): Promise<boolean> => {
    isSaving.value = true
    try {
      if (newConfig) {
        Object.assign(sharedHeaderFooter, newConfig)
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(HEADER_FOOTER_STORAGE_KEY, JSON.stringify(sharedHeaderFooter))
      }

      const { initFirebase } = useFirebase()
      initFirebase()
      // @ts-ignore
      const db = (window as any).__hc_firestore_instance
      if (db) {
        await setDoc(doc(db, 'system_settings', 'header_footer'), JSON.parse(JSON.stringify(sharedHeaderFooter)), { merge: true })
      }
      return true
    } catch (err) {
      console.warn('[Site Content] Error saving Header/Footer settings:', err)
      return false
    } finally {
      isSaving.value = false
    }
  }

  const saveContactPageConfig = async (newConfig?: Partial<ContactPageConfig>): Promise<boolean> => {
    isSaving.value = true
    try {
      if (newConfig) {
        Object.assign(sharedContactPage, newConfig)
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(CONTACT_PAGE_STORAGE_KEY, JSON.stringify(sharedContactPage))
      }

      const { initFirebase } = useFirebase()
      initFirebase()
      // @ts-ignore
      const db = (window as any).__hc_firestore_instance
      if (db) {
        await setDoc(doc(db, 'system_settings', 'contact_page'), JSON.parse(JSON.stringify(sharedContactPage)), { merge: true })
      }
      return true
    } catch (err) {
      console.warn('[Site Content] Error saving Contact Page settings:', err)
      return false
    } finally {
      isSaving.value = false
    }
  }

  const resetTrendingBarToDefaults = () => {
    Object.assign(sharedHeaderFooter.trendingBar, JSON.parse(JSON.stringify(defaultHeaderFooterConfig.trendingBar)))
    if (typeof window !== 'undefined') {
      localStorage.setItem(HEADER_FOOTER_STORAGE_KEY, JSON.stringify(sharedHeaderFooter))
    }
  }

  const resetHeaderFooterToDefaults = () => {
    Object.assign(sharedHeaderFooter, JSON.parse(JSON.stringify(defaultHeaderFooterConfig)))
    if (typeof window !== 'undefined') {
      localStorage.setItem(HEADER_FOOTER_STORAGE_KEY, JSON.stringify(sharedHeaderFooter))
    }
  }

  const resetContactPageToDefaults = () => {
    Object.assign(sharedContactPage, JSON.parse(JSON.stringify(defaultContactPageConfig)))
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONTACT_PAGE_STORAGE_KEY, JSON.stringify(sharedContactPage))
    }
  }

  return {
    headerFooterConfig: sharedHeaderFooter,
    contactPageConfig: sharedContactPage,
    isSaving,
    saveHeaderFooterConfig,
    saveContactPageConfig,
    resetTrendingBarToDefaults,
    resetHeaderFooterToDefaults,
    resetContactPageToDefaults,
    syncSiteContentFromCloud
  }
}

