// https://nuxt.com/docs/api/configuration/nuxt-config
const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAQaA9qugSaMxKMmqiQYPUBmTWz827EvFI',
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'headline-central.firebaseapp.com',
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'headline-central',
        databaseId: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_ID || 'headline-central',
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'headline-central.firebasestorage.app',
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '523616926810',
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:523616926810:web:257d509d40ed4b39606c63'
      },
      analytics: {
        gtmId: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-PNT79WT8',
        ga4Id: process.env.NUXT_PUBLIC_GA4_ID || 'G-TD8S7EFPLV',
        metaPixelId: process.env.NUXT_PUBLIC_META_PIXEL_ID || ''
      },
      gateway: {
        username: process.env.NUXT_PUBLIC_CMS_GATEWAY_USERNAME || '@Dm1n902@6!',
        password: process.env.NUXT_PUBLIC_CMS_GATEWAY_PASSWORD || 'CMsL@g!n2@26!'
      }
    }
  },
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Headline Central — Essential Stories & Investigative Digital Journalism',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Headline Central is your premier digital publication covering technology breakthroughs, hardware retrospectives, and in-depth cultural analysis.' },
        { name: 'theme-color', content: '#ee5102' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      failOnError: false,
      concurrency: 1,
      routes: [
        '/',
        '/blog',
        '/categories',
        '/contact',
        '/cookies',
        '/privacy',
        '/terms',
        '/editorial-policy',
        '/cms',
        '/cms/login'
      ]
    },
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
        }
      }
    }
  },
  vite: {
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
      }
    }
  }
})

