<template>
  <div
    v-if="trendingBar && trendingBar.isVisible !== false"
    class="bg-[#414045] text-white text-xs py-2 px-4 transition-all"
  >
    <div class="max-w-[1600px] mx-auto flex items-center justify-center space-x-2">
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#EE5102] flex-shrink-0 animate-pulse"></span>
      <span class="text-[#9ca3af] font-normal">{{ trendingBar.label || 'Trending now:' }}</span>
      <NuxtLink
        :to="trendingBar.link || '/blog'"
        class="text-white font-normal hover:text-[#EE5102] transition-colors truncate max-w-xl"
      >
        {{ trendingBar.text || 'Welcome to Headline Central — Essential Stories & Investigative Digital Journalism.' }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteContent } from '~/composables/useSiteContent'

const { headerFooterConfig } = useSiteContent()
const trendingBar = computed(() => headerFooterConfig.trendingBar)
</script>
