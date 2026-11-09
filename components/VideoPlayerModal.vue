<template>
  <div
    v-if="isOpen && videoUrl"
    class="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    @click.self="close"
  >
    <div class="bg-gray-950 rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-800 overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-black/40">
        <div class="min-w-0 pr-4">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#EE5102]">Playing Video</span>
          <h3 class="text-sm sm:text-base font-bold text-white truncate mt-0.5">
            {{ title || 'Headline Central Video Player' }}
          </h3>
        </div>
        <button
          @click="close"
          type="button"
          class="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Close video player"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Video Player Viewport -->
      <div class="aspect-video w-full bg-black relative flex items-center justify-center">
        <!-- Embed (YouTube / Vimeo) -->
        <iframe
          v-if="isEmbedVideo(videoUrl)"
          :src="getEmbedVideoUrl(videoUrl)"
          class="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          :title="title"
        ></iframe>

        <!-- Native HTML5 Video -->
        <video
          v-else
          :src="useAsset(videoUrl)"
          controls
          autoplay
          playsinline
          class="w-full h-full object-contain bg-black"
        ></video>
      </div>

      <!-- Footer Info -->
      <div class="p-4 sm:p-5 border-t border-gray-800 bg-gray-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="text-gray-400">
          <span v-if="caption" class="italic text-gray-300 block mb-0.5">{{ caption }}</span>
          <span v-if="credit" class="text-[11px] text-gray-500">Source: {{ credit }}</span>
        </div>
        <NuxtLink
          v-if="articleSlug"
          :to="`/blog/${articleSlug}`"
          @click="close"
          class="px-5 py-2 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white font-semibold transition-colors shadow-sm ml-auto"
        >
          Read Full Story &rarr;
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsset } from '~/composables/useAsset'

const props = defineProps<{
  isOpen: boolean
  videoUrl?: string
  title?: string
  caption?: string
  credit?: string
  articleSlug?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}

const isEmbedVideo = (url?: string): boolean => {
  if (!url) return false
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
}

const getEmbedVideoUrl = (url?: string): string => {
  if (!url) return ''
  let trimmed = url.trim()

  // If a full iframe tag was pasted, extract the src attribute
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i)
  if (iframeMatch && iframeMatch[1]) {
    trimmed = iframeMatch[1]
  }

  if (trimmed.includes('youtube.com/embed/')) {
    const glue = trimmed.includes('?') ? '&' : '?'
    return `${trimmed}${glue}autoplay=1`
  }

  if (trimmed.includes('youtube.com/watch?v=')) {
    const id = trimmed.split('v=')[1]?.split('&')[0]
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : trimmed
  }

  if (trimmed.includes('youtube.com/shorts/')) {
    const id = trimmed.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('/')[0]
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : trimmed
  }

  if (trimmed.includes('youtu.be/')) {
    const id = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0]
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : trimmed
  }

  if (trimmed.includes('vimeo.com/')) {
    if (trimmed.includes('player.vimeo.com/video/')) {
      const glue = trimmed.includes('?') ? '&' : '?'
      return `${trimmed}${glue}autoplay=1`
    }
    const id = trimmed.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0]
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : trimmed
  }

  return trimmed
}
</script>

