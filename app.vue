<template>
  <div>
    <!-- Google Tag Manager (noscript) fallback for public pages (only active when analytics consent is granted) -->
    <noscript v-if="!isCmsRoute && validGtmId && trackingConfig.enableGtm && allowsAnalytics">
      <iframe
        :src="`https://www.googletagmanager.com/ns.html?id=${validGtmId}`"
        height="0"
        width="0"
        style="display:none;visibility:hidden"
      ></iframe>
    </noscript>

    <!-- Meta Pixel (noscript) fallback for public pages (only active when advertising consent is granted) -->
    <noscript v-if="!isCmsRoute && validMetaPixelId && trackingConfig.enableMetaPixel && allowsAdvertising">
      <img
        height="1"
        width="1"
        style="display:none"
        :src="`https://www.facebook.com/tr?id=${validMetaPixelId}&ev=PageView&noscript=1`"
        alt=""
      />
    </noscript>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  useSiteSeo,
  sanitizeGtmId,
  sanitizeGa4Id,
  sanitizeMetaPixelId,
  sanitizeAdsenseId
} from '~/composables/useSiteSeo'
import { useCookieConsent } from '~/composables/useCookieConsent'
import { useSiteContent } from '~/composables/useSiteContent'
import { useArticles } from '~/composables/useArticles'
import { useBanners } from '~/composables/useBanners'

const route = useRoute()
const { trackingConfig, syncSeoFromCloud } = useSiteSeo()
const { allowsAnalytics, allowsAdvertising, initConsent } = useCookieConsent()
const { syncSiteContentFromCloud } = useSiteContent()
const { syncFromFirestore: syncArticlesAndCategories } = useArticles()
const { syncFromFirestore: syncHeroBanners } = useBanners()

onMounted(async () => {
  initConsent()
  await Promise.allSettled([
    syncSeoFromCloud(),
    syncSiteContentFromCloud(),
    syncArticlesAndCategories(),
    syncHeroBanners()
  ])
})

const isCmsRoute = computed(() =>
  route.path.startsWith('/cms') || route.path.startsWith('/admin')
)

const validGtmId = computed(() => sanitizeGtmId(trackingConfig.gtmId))
const validGa4Id = computed(() => sanitizeGa4Id(trackingConfig.ga4Id))
const validMetaPixelId = computed(() => sanitizeMetaPixelId(trackingConfig.metaPixelId))
const validAdsenseId = computed(() => sanitizeAdsenseId(trackingConfig.adsensePublisherId))

// Ensure runtime updates to the GTM ID from CMS/Firestore dynamically inject/update the script in document.head
watch(
  [validGtmId, () => trackingConfig.enableGtm, allowsAnalytics, isCmsRoute],
  ([gtmId, enabled, consentOk, inCms]) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    if (inCms || !gtmId || !enabled || !consentOk) return

    const expectedSrc = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
    const existingScripts = Array.from(document.head.querySelectorAll('script'))
    const alreadyLoaded = existingScripts.some(s => s.src === expectedSrc)

    if (!alreadyLoaded) {
      // Remove any outdated gtm.js script tags so the updated container ID takes over cleanly
      existingScripts.forEach((s) => {
        if (s.src && s.src.includes('googletagmanager.com/gtm.js?id=')) {
          s.parentNode?.removeChild(s)
        }
      })

      const w = window as any
      w.dataLayer = w.dataLayer || []
      w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

      const scriptEl = document.createElement('script')
      scriptEl.async = true
      scriptEl.src = expectedSrc
      scriptEl.setAttribute('data-gtm-id', gtmId)
      document.head.insertBefore(scriptEl, document.head.firstChild)
    }
  },
  { immediate: true }
)

useHead(() => {
  if (isCmsRoute.value) {
    return {}
  }

  const scripts: any[] = []
  const metaTags: any[] = []

  // 1. Google Tag Manager (GTM) - Requires Analytics consent
  if (validGtmId.value && trackingConfig.enableGtm && allowsAnalytics.value) {
    scripts.push(
      {
        key: 'gtm-script-src',
        src: `https://www.googletagmanager.com/gtm.js?id=${validGtmId.value}`,
        async: true
      },
      {
        key: 'gtm-dataLayer-init',
        innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${validGtmId.value}');`
      }
    )
  }

  // 2. Google Analytics 4 (GA4 Direct gtag.js) - Requires Analytics consent
  if (validGa4Id.value && trackingConfig.enableGa4 && allowsAnalytics.value) {
    scripts.push(
      {
        key: 'ga4-src',
        src: `https://www.googletagmanager.com/gtag/js?id=${validGa4Id.value}`,
        async: true
      },
      {
        key: 'ga4-init',
        innerHTML: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${validGa4Id.value}', { send_page_view: true });`
      }
    )
  }

  // 3. Meta Pixel (Facebook Pixel) - Requires Advertising consent
  if (validMetaPixelId.value && trackingConfig.enableMetaPixel && allowsAdvertising.value) {
    scripts.push({
      key: 'meta-pixel-init',
      innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${validMetaPixelId.value}');fbq('track', 'PageView');`
    })
  }

  // 4. Google AdSense Verification & Auto-Ads Tag
  if (validAdsenseId.value && trackingConfig.enableAdsense) {
    scripts.push({
      key: 'adsense-script',
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${validAdsenseId.value}`,
      async: true,
      crossorigin: 'anonymous'
    })
    metaTags.push({
      name: 'google-adsense-account',
      content: validAdsenseId.value
    })
  }

  return {
    script: scripts,
    meta: metaTags
  }
})

// SPA Route Change Tracking for GTM, GA4, and Meta Pixel (Strictly respect cookie consent)
watch(
  () => route.fullPath,
  (newPath) => {
    if (typeof window === 'undefined' || isCmsRoute.value) return
    const w = window as any

    // Push GTM virtual page_view event (if authorized)
    if (validGtmId.value && trackingConfig.enableGtm && allowsAnalytics.value && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({
        event: 'page_view',
        page_path: newPath,
        page_title: document.title
      })
    }

    // Push GA4 config page_path update (if authorized)
    if (validGa4Id.value && trackingConfig.enableGa4 && allowsAnalytics.value && typeof w.gtag === 'function') {
      w.gtag('config', validGa4Id.value, {
        page_path: newPath,
        page_title: document.title
      })
    }

    // Push Meta Pixel PageView event (if authorized)
    if (validMetaPixelId.value && trackingConfig.enableMetaPixel && allowsAdvertising.value && typeof w.fbq === 'function') {
      w.fbq('track', 'PageView')
    }
  }
)
</script>
