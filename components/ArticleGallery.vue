<template>
  <div class="w-full my-8">
    <!-- Main Image Display Container -->
    <div class="w-full flex justify-center">
      <div class="relative w-full lg:w-[1040px] lg:h-[600px] h-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg bg-gray-950 flex items-center justify-center group">
        <a
          v-if="normalizedImages[currentIndex]?.linkUrl"
          :href="formatLinkUrl(normalizedImages[currentIndex]?.linkUrl)"
          :target="isExternalUrl(normalizedImages[currentIndex]?.linkUrl) ? '_blank' : '_self'"
          :rel="isExternalUrl(normalizedImages[currentIndex]?.linkUrl) ? 'noopener noreferrer' : undefined"
          class="w-full h-full flex items-center justify-center relative"
        >
          <img
            :src="normalizedImages[currentIndex]?.src"
            :alt="normalizedImages[currentIndex]?.alt || `Gallery image ${currentIndex + 1}`"
            class="w-full h-auto lg:w-[1040px] lg:h-[600px] object-cover transition-all duration-300"
          />
          <span class="absolute bottom-4 left-4 bg-black/75 hover:bg-[#EE5102] backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5 transition-colors shadow-md">
            <span>Visit Link</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </span>
        </a>
        <img
          v-else
          :src="normalizedImages[currentIndex]?.src"
          :alt="normalizedImages[currentIndex]?.alt || `Gallery image ${currentIndex + 1}`"
          class="w-full h-auto lg:w-[1040px] lg:h-[600px] object-cover transition-all duration-300"
        />

        <!-- Image Counter Badge (Bottom Right) -->
        <div class="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-mono flex items-center space-x-1 shadow-md">
          <span class="text-[#EE5102] font-semibold">{{ currentIndex + 1 }}</span>
          <span class="text-gray-400">/</span>
          <span>{{ normalizedImages.length }}</span>
        </div>

        <!-- Left / Right Click Controls on main image (hover) -->
        <button
          @click="prevImage"
          aria-label="Previous image"
          class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#EE5102] text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="nextImage"
          aria-label="Next image"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#EE5102] text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Thumbnail Strip with Navigation Buttons -->
    <div class="w-full max-w-[1040px] mx-auto mt-4 flex items-center space-x-3 px-1">
      <!-- Previous Thumbnails Button -->
      <button
        @click="prevImage"
        aria-label="Previous slide"
        class="w-8 h-8 rounded-full border border-gray-200 bg-white hover:border-[#EE5102] hover:text-[#EE5102] text-gray-600 flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Thumbnails Container (Horizontal Scrollable) -->
      <div
        ref="thumbnailsContainer"
        class="flex-1 flex items-center space-x-2.5 overflow-x-auto py-1 scrollbar-none scroll-smooth"
      >
        <button
          v-for="(img, idx) in normalizedImages"
          :key="`${img.src}-${idx}`"
          @click="setIndex(idx)"
          :class="[
            'relative rounded-xl overflow-hidden flex-shrink-0 w-20 sm:w-24 aspect-[16/10] transition-all duration-200 border-2',
            currentIndex === idx ? 'border-[#EE5102] ring-2 ring-[#EE5102]/30 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
          ]"
          :aria-label="img.alt || `Select image ${idx + 1}`"
        >
          <img
            :src="img.src"
            :alt="img.alt || `Thumbnail ${idx + 1}`"
            class="w-full h-full object-cover"
          />
        </button>
      </div>

      <!-- Next Thumbnails Button (Orange as in reference) -->
      <button
        @click="nextImage"
        aria-label="Next slide"
        class="w-8 h-8 rounded-full bg-[#EE5102] hover:bg-[#d84802] text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Optional Caption & Image Credit Below Gallery -->
    <div v-if="caption || normalizedImages[currentIndex]?.credit" class="mt-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs text-center">
      <p v-if="caption" class="text-gray-500 italic">
        {{ caption }}
      </p>
      <span v-if="caption && normalizedImages[currentIndex]?.credit" class="hidden sm:inline text-gray-300">•</span>
      <p v-if="normalizedImages[currentIndex]?.credit" class="text-gray-400 font-medium">
        Source / Credit:
        <a
          v-if="normalizedImages[currentIndex]?.linkUrl"
          :href="formatLinkUrl(normalizedImages[currentIndex]?.linkUrl)"
          :target="isExternalUrl(normalizedImages[currentIndex]?.linkUrl) ? '_blank' : '_self'"
          :rel="isExternalUrl(normalizedImages[currentIndex]?.linkUrl) ? 'noopener noreferrer' : undefined"
          class="text-[#EE5102] hover:underline"
        >{{ normalizedImages[currentIndex]?.credit }}</a>
        <span v-else class="text-gray-600">{{ normalizedImages[currentIndex]?.credit }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GalleryItem } from '~/composables/useArticles'

const props = withDefaults(
  defineProps<{
    images: (string | GalleryItem)[]
    caption?: string
    initialIndex?: number
  }>(),
  {
    caption: '',
    initialIndex: 0
  }
)

const formatLinkUrl = (url?: string): string => {
  if (!url) return '#'
  const trimmed = url.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:')
  ) {
    return trimmed
  }
  return `https://${trimmed}`
}

const isExternalUrl = (url?: string): boolean => {
  if (!url) return false
  const formatted = formatLinkUrl(url)
  return formatted.startsWith('http://') || formatted.startsWith('https://')
}

const normalizedImages = computed<GalleryItem[]>(() =>
  props.images.slice(0, 12).map((item, idx) =>
    typeof item === 'string'
      ? { src: useAsset(item), alt: `Gallery image ${idx + 1}` }
      : {
          src: useAsset(item.src),
          alt: item.alt || `Gallery image ${idx + 1}`,
          credit: item.credit,
          linkUrl: item.linkUrl
        }
  )
)

const currentIndex = ref(props.initialIndex)
const thumbnailsContainer = ref<HTMLElement | null>(null)

const setIndex = (idx: number) => {
  currentIndex.value = idx
  scrollToThumb(idx)
}

const nextImage = () => {
  if (currentIndex.value < normalizedImages.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
  scrollToThumb(currentIndex.value)
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = normalizedImages.value.length - 1
  }
  scrollToThumb(currentIndex.value)
}

const scrollToThumb = (idx: number) => {
  if (!thumbnailsContainer.value) return
  const buttons = thumbnailsContainer.value.querySelectorAll('button')
  if (buttons[idx]) {
    buttons[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>

