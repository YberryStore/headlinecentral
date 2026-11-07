<template>
  <div>
    <!-- Google Tag Manager (noscript) fallback for public pages -->
    <noscript v-if="!isCmsRoute && validGtmId && trackingConfig.enableGtm">
      <iframe
        :src="`https://www.googletagmanager.com/ns.html?id=${validGtmId}`"
        height="0"
        width="0"
        style="display:none;visibility:hidden"
      ></iframe>
    </noscript>

    <!-- Meta Pixel (noscript) fallback for public pages -->
    <noscript v-if="!isCmsRoute && validMetaPixelId && trackingConfig.enableMetaPixel">
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
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  useSiteSeo,
  sanitizeGtmId,
  sanitizeGa4Id,
  sanitizeMetaPixelId
} from '~/composables/useSiteSeo'

const route = useRoute()
const { trackingConfig } = useSiteSeo()

const isCmsRoute = computed(() =>
  route.path.startsWith('/cms') || route.path.startsWith('/admin')
)

const validGtmId = computed(() => sanitizeGtmId(trackingConfig.gtmId))
const validGa4Id = computed(() => sanitizeGa4Id(trackingConfig.ga4Id))
const validMetaPixelId = computed(() => sanitizeMetaPixelId(trackingConfig.metaPixelId))

useHead(() => {
  if (isCmsRoute.value) {
    return {}
  }

  const scripts: any[] = []

  // 1. Google Tag Manager (GTM)
  if (validGtmId.value && trackingConfig.enableGtm) {
    scripts.push({
      key: 'gtm-script',
      innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${validGtmId.value}');`
    })
  }

  // 2. Google Analytics 4 (GA4 Direct gtag.js)
  if (validGa4Id.value && trackingConfig.enableGa4) {
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

  // 3. Meta Pixel (Facebook Pixel)
  if (validMetaPixelId.value && trackingConfig.enableMetaPixel) {
    scripts.push({
      key: 'meta-pixel-init',
      innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${validMetaPixelId.value}');fbq('track', 'PageView');`
    })
  }

  return {
    script: scripts
  }
})

// SPA Route Change Tracking for GTM, GA4, and Meta Pixel
watch(
  () => route.fullPath,
  (newPath) => {
    if (typeof window === 'undefined' || isCmsRoute.value) return
    const w = window as any

    // Push GTM virtual page_view event
    if (validGtmId.value && trackingConfig.enableGtm && Array.isArray(w.dataLayer)) {
      w.dataLayer.push({
        event: 'page_view',
        page_path: newPath,
        page_title: document.title
      })
    }

    // Push GA4 config page_path update
    if (validGa4Id.value && trackingConfig.enableGa4 && typeof w.gtag === 'function') {
      w.gtag('config', validGa4Id.value, {
        page_path: newPath,
        page_title: document.title
      })
    }

    // Push Meta Pixel PageView event
    if (validMetaPixelId.value && trackingConfig.enableMetaPixel && typeof w.fbq === 'function') {
      w.fbq('track', 'PageView')
    }
  }
)
</script>
