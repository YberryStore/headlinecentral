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
  supportEmail: string
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

const LEGACY_DEFAULT_NAV_IDS = new Set([
  'nav-news',
  'nav-tech',
  'nav-fashion',
  'nav-food',
  'nav-home',
  'nav-parenting'
])

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
  navItems: [],
  footer: {
    brandDescription: 'Essential long-form journalism, rigorous analysis, and investigative digital storytelling.',
    copyright: '© 2026 Headline Central. All rights reserved.',
    contactEmail: 'support@headlinecentral.co.za',
    contactPhone: '',
    contactAddress: '',
    socialLinks: {
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      facebook: '',
      instagram: '',
      rss: '/rss.xml'
    },
    editorialLinks: [
      { label: 'Editorial Policy', to: '/editorial-policy' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Press & Newsroom', to: '/contact' }
    ],
    legalLinks: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Cookie Preferences', to: '#cookie-preferences' }
    ]
  }
}

const defaultContactPageConfig: ContactPageConfig = {
  badge: 'Get in Touch',
  title: 'Contact the Newsroom',
  description: 'Whether you have an investigative tip, a partnership proposal, or a factual correction, we are eager to hear from you.',
  supportEmail: 'support@headlinecentral.co.za',
  pitchesEmail: 'support@headlinecentral.co.za',
  correctionsEmail: 'support@headlinecentral.co.za',
  advertisingEmail: 'support@headlinecentral.co.za',
  generalEmail: 'support@headlinecentral.co.za',
  phone: '',
  address: '',
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
          if (Array.isArray(parsed.navItems)) {
            parsed.navItems = parsed.navItems.filter((item: NavMenuItem) => !LEGACY_DEFAULT_NAV_IDS.has(item.id))
          }
          Object.assign(sharedHeaderFooter, parsed)
          localStorage.setItem(HEADER_FOOTER_STORAGE_KEY, JSON.stringify(sharedHeaderFooter))
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
      const { fetchLiveConfig } = useFirebase()

      const cloudHf = await fetchLiveConfig<HeaderFooterConfig>('header_footer')
      if (cloudHf && typeof cloudHf === 'object') {
        if (Array.isArray(cloudHf.navItems)) {
          cloudHf.navItems = cloudHf.navItems.filter((item: NavMenuItem) => !LEGACY_DEFAULT_NAV_IDS.has(item.id))
        }
        Object.assign(sharedHeaderFooter, cloudHf)
        try {
          localStorage.setItem(HEADER_FOOTER_STORAGE_KEY, JSON.stringify(sharedHeaderFooter))
        } catch {}
      }

      const cloudContact = await fetchLiveConfig<ContactPageConfig>('contact_page')
      if (cloudContact && typeof cloudContact === 'object') {
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

      const { saveLiveConfig } = useFirebase()
      await saveLiveConfig('header_footer', JSON.parse(JSON.stringify(sharedHeaderFooter)))
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

      const { saveLiveConfig } = useFirebase()
      await saveLiveConfig('contact_page', JSON.parse(JSON.stringify(sharedContactPage)))
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

