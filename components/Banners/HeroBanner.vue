<template>
  <section v-if="displayBanner || article" class="bg-white pt-4 pb-12 sm:pb-16 relative overflow-hidden">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- CMS HERO BANNER (When active CMS banners exist) -->
      <div v-if="displayBanner" class="relative group/carousel">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">
          
          <!-- Left Column: Banner Text & Actions -->
          <div class="flex-1 w-full flex flex-col justify-between py-2 sm:py-4">
            <div>
              <!-- Optional Category / Badge Marker -->
              <div v-if="displayBanner.badgeText" class="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-orange-50 border border-orange-100/80 text-[#EE5102] text-xs font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-[#EE5102] animate-pulse"></span>
                <span>{{ displayBanner.badgeText }}</span>
              </div>

              <!-- Headline -->
              <h1 class="text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] font-medium leading-[1.25] text-gray-950 font-sans tracking-tight hover:text-[#EE5102] transition-colors">
                <NuxtLink :to="displayBanner.customUrl || '/blog'" :target="displayBanner.cta?.targetBlank ? '_blank' : '_self'">
                  <template v-if="displayBanner.headlineHighlight">
                    <span class="text-[#EE5102]">{{ displayBanner.headlineHighlight }}</span>
                    {{ displayBanner.headline.replace(displayBanner.headlineHighlight, '') }}
                  </template>
                  <template v-else>
                    {{ displayBanner.headline }}
                  </template>
                </NuxtLink>
              </h1>

              <!-- Caption -->
              <p v-if="displayBanner.caption" class="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 font-normal leading-[1.65] max-w-xl">
                {{ displayBanner.caption }}
              </p>
            </div>

            <!-- Bottom Row: Controls / CTA / Slide Index -->
            <div class="mt-8 sm:mt-12 flex flex-wrap items-center justify-between gap-4 max-w-xl">
              <!-- Carousel Controls (When multiple banners active) -->
              <div v-if="totalBanners > 1" class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <button
                    @click="prevSlide"
                    type="button"
                    aria-label="Previous Banner"
                    class="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-xs"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button
                    @click="nextSlide"
                    type="button"
                    aria-label="Next Banner"
                    class="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-xs"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
                <span class="text-xs text-gray-400 font-medium tracking-wider">
                  {{ String(currentIndex + 1).padStart(2, '0') }} / {{ String(totalBanners).padStart(2, '0') }}
                </span>
              </div>

              <div v-else class="text-xs text-gray-400">
                <span>Featured Presentation</span>
              </div>

              <!-- CTA Button -->
              <NuxtLink
                v-if="displayBanner.cta?.enabled !== false"
                :to="displayBanner.cta?.url || displayBanner.customUrl || '/blog'"
                :target="displayBanner.cta?.targetBlank ? '_blank' : '_self'"
                :class="getCtaClasses(displayBanner.cta?.style)"
                class="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-sm font-normal transition-colors shadow-sm flex-shrink-0"
              >
                {{ displayBanner.cta?.label || 'Explore Now' }}
              </NuxtLink>
            </div>
          </div>

          <!-- Right Column: Media (Desktop & Mobile Support + Video) -->
          <div class="w-full lg:w-[900px] flex-shrink-0">
            <div class="block w-full lg:w-[900px] lg:h-[500px] aspect-[9/5] lg:aspect-auto rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-sm bg-gray-950 relative group">
              
              <!-- IMAGE MEDIA TYPE with Desktop & Mobile Responsive Picture -->
              <NuxtLink
                v-if="displayBanner.mediaType === 'image'"
                :to="displayBanner.customUrl || '/blog'"
                :target="displayBanner.cta?.targetBlank ? '_blank' : '_self'"
                class="block w-full h-full"
              >
                <picture class="w-full h-full block">
                  <source
                    v-if="displayBanner.mobileImageUrl"
                    media="(max-width: 768px)"
                    :srcset="resolveMediaUrl(displayBanner.mobileImageUrl)"
                  />
                  <img
                    :src="resolveMediaUrl(displayBanner.desktopImageUrl)"
                    :alt="displayBanner.desktopAlt || displayBanner.headline"
                    class="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    loading="eager"
                  />
                </picture>
              </NuxtLink>

              <!-- VIDEO MEDIA TYPE -->
              <div v-else-if="displayBanner.mediaType === 'video'" class="w-full h-full relative bg-black flex items-center justify-center">
                <!-- YouTube or Vimeo Embed -->
                <iframe
                  v-if="isEmbedVideo(displayBanner.videoUrl)"
                  :src="getEmbedUrl(displayBanner.videoUrl)"
                  class="w-full h-full border-0 pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title="Hero Banner Video"
                ></iframe>

                <!-- Direct HTML5 Video Player -->
                <video
                  v-else-if="displayBanner.videoUrl"
                  ref="videoPlayer"
                  :src="resolveMediaUrl(displayBanner.videoUrl)"
                  :poster="displayBanner.videoPosterUrl ? resolveMediaUrl(displayBanner.videoPosterUrl) : undefined"
                  :autoplay="displayBanner.videoAutoplay !== false"
                  :loop="displayBanner.videoLoop !== false"
                  :muted="displayBanner.videoMuted !== false"
                  playsinline
                  class="w-full h-full object-cover object-center"
                ></video>

                <!-- Video Fallback Image if video URL not provided -->
                <img
                  v-else-if="displayBanner.desktopImageUrl"
                  :src="resolveMediaUrl(displayBanner.desktopImageUrl)"
                  :alt="displayBanner.desktopAlt || displayBanner.headline"
                  class="w-full h-full object-cover object-center"
                />

                <!-- Click overlay for custom URL -->
                <NuxtLink
                  v-if="displayBanner.customUrl"
                  :to="displayBanner.customUrl"
                  :target="displayBanner.cta?.targetBlank ? '_blank' : '_self'"
                  class="absolute inset-0 z-10"
                  aria-label="View featured banner"
                ></NuxtLink>
              </div>

              <!-- Carousel Dots Indicator (Bottom Overlay) -->
              <div v-if="totalBanners > 1" class="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
                <button
                  v-for="(_, index) in activeBanners"
                  :key="index"
                  @click="goToSlide(index)"
                  type="button"
                  :aria-label="`Go to slide ${index + 1}`"
                  :class="[
                    currentIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                  ]"
                  class="h-2 rounded-full transition-all duration-300 shadow-sm"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- EDITORIAL ARTICLE HERO (Fallback when no active CMS banners exist) -->
      <div v-else-if="article" class="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">
        <!-- Left Column: Article Info -->
        <div class="flex-1 w-full flex flex-col justify-between py-2 sm:py-4">
          <div>
            <!-- Heading -->
            <h1 class="text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] font-medium leading-[1.25] text-gray-950 font-sans tracking-tight hover:text-[#EE5102] transition-colors">
              <NuxtLink :to="`/blog/${article.slug}`">
                <template v-if="article.titleHighlight">
                  <span class="text-[#EE5102]">{{ article.titleHighlight }}</span>
                  {{ article.title.replace(article.titleHighlight, '') }}
                </template>
                <template v-else>
                  {{ article.title }}
                </template>
              </NuxtLink>
            </h1>

            <!-- Excerpt / Subtitle -->
            <p class="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 font-normal leading-[1.65] max-w-xl">
              {{ article.excerpt }}
            </p>
          </div>

          <!-- Bottom Row: Date & Reading Time + Read Story Button -->
          <div class="mt-8 sm:mt-12 flex items-center justify-between max-w-xl">
            <span class="text-xs sm:text-[13px] text-gray-400 font-normal">
              {{ article.publishedAt }} • {{ article.readTime }}
            </span>

            <NuxtLink
              :to="`/blog/${article.slug}`"
              class="inline-flex items-center justify-center px-7 py-2.5 rounded-full text-sm font-normal text-white bg-[#EE5102] hover:bg-[#d84802] transition-colors shadow-sm flex-shrink-0"
            >
              Read Story
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column: Banner Image (900x500 on Desktop) -->
        <div class="w-full lg:w-[900px] flex-shrink-0">
          <NuxtLink
            :to="`/blog/${article.slug}`"
            class="block w-full lg:w-[900px] lg:h-[500px] aspect-[9/5] lg:aspect-auto rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-sm bg-gray-950 group"
          >
            <img
              :src="useAsset(article.featuredImage || article.bannerImage)"
              :alt="article.title"
              class="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
            />
          </NuxtLink>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Article } from '~/composables/useArticles'
import { useBanners, type HeroBanner } from '~/composables/useBanners'

const props = defineProps<{
  article?: Article | null
  customBanner?: HeroBanner | null
}>()

const { activeBanners, syncFromFirestore } = useBanners()

const currentIndex = ref(0)
let autoplayTimer: any = null

const totalBanners = computed(() => {
  if (props.customBanner) return 1
  return activeBanners.value.length
})

const displayBanner = computed<HeroBanner | null>(() => {
  if (props.customBanner) return props.customBanner
  if (activeBanners.value.length > 0) {
    const idx = currentIndex.value % activeBanners.value.length
    return activeBanners.value[idx]
  }
  return null
})

const resolveMediaUrl = (url?: string) => {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return useAsset(trimmed)
}

const isEmbedVideo = (url?: string): boolean => {
  if (!url) return false
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
}

const getEmbedUrl = (url?: string): string => {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0`
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0`
  }
  if (url.includes('vimeo.com/')) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0]
    return `https://player.vimeo.com/video/${id}?autoplay=1&loop=1&muted=1&background=1`
  }
  return url
}

const getCtaClasses = (style?: string) => {
  switch (style) {
    case 'dark':
      return 'bg-gray-900 text-white hover:bg-black'
    case 'outline':
      return 'border-2 border-[#EE5102] text-[#EE5102] hover:bg-[#EE5102] hover:text-white'
    case 'white':
      return 'bg-white text-gray-900 hover:bg-gray-100'
    case 'primary':
    default:
      return 'bg-[#EE5102] text-white hover:bg-[#d84802]'
  }
}

const nextSlide = () => {
  if (totalBanners.value <= 1) return
  currentIndex.value = (currentIndex.value + 1) % totalBanners.value
}

const prevSlide = () => {
  if (totalBanners.value <= 1) return
  currentIndex.value = (currentIndex.value - 1 + totalBanners.value) % totalBanners.value
}

const goToSlide = (idx: number) => {
  currentIndex.value = idx
}

const startAutoplay = () => {
  stopAutoplay()
  if (totalBanners.value > 1) {
    autoplayTimer = setInterval(() => {
      nextSlide()
    }, 8000)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(async () => {
  await syncFromFirestore().catch(() => {})
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>
