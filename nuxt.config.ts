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
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || (isProduction ? '/headlinecentral/' : '/'),
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
  }
})

