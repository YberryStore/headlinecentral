<template>
  <div
    v-if="isVisible"
    class="adsense-vertical-unit w-full overflow-hidden my-4"
  >
    <!-- Ad Header Label -->
    <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100">
      <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{{ label }}</span>
      <span class="text-[9px] text-gray-300">Google Ad</span>
    </div>

    <div class="bg-gray-50/70 rounded-2xl p-2.5 sm:p-3 border border-gray-100 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[500px] overflow-hidden">
      <!-- Verticle Ad -->
      <ins
        class="adsbygoogle"
        style="display:block; min-width: 250px; width: 100%;"
        :data-ad-client="activeClient"
        :data-ad-slot="activeSlot"
        :data-ad-format="format"
        :data-full-width-responsive="fullWidthResponsive ? 'true' : 'false'"
      ></ins>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick } from 'vue'
import { useSiteSeo } from '~/composables/useSiteSeo'

const props = withDefaults(defineProps<{
  adSlot?: string
  adClient?: string
  format?: string
  fullWidthResponsive?: boolean
  label?: string
}>(), {
  adSlot: '3663504600',
  adClient: 'ca-pub-2117003220546001',
  format: 'auto',
  fullWidthResponsive: true,
  label: 'Advertisement'
})

const { trackingConfig } = useSiteSeo()

const activeClient = computed(() => trackingConfig.adsensePublisherId || props.adClient)
const activeSlot = computed(() => trackingConfig.adsenseVerticalSlot || props.adSlot)
const isVisible = computed(() => trackingConfig.enableAdsense !== false && trackingConfig.enableAdSlots !== false)

useHead(() => ({
  script: [
    {
      key: 'adsense-script',
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${activeClient.value}`,
      async: true,
      crossorigin: 'anonymous'
    }
  ]
}))

let isPushed = false

onMounted(() => {
  nextTick(() => {
    if (process.client && isVisible.value && !isPushed) {
      try {
        const w = window as any
        w.adsbygoogle = w.adsbygoogle || []
        w.adsbygoogle.push({})
        isPushed = true
      } catch (err) {
        // Safe catch for fast client navigation
      }
    }
  })
})
</script>

