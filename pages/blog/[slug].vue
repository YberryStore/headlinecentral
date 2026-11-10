<template>
  <div>
    <!-- Draft Preview Notice Banner -->
    <div
      v-if="article && article.status === 'draft'"
      class="bg-amber-500 text-white px-4 py-2 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50"
    >
      <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      <span>DRAFT PREVIEW MODE — This article is saved as a draft and is not visible to public readers.</span>
      <NuxtLink to="/cms" class="underline text-white font-bold ml-2">Open CMS Editor</NuxtLink>
    </div>

    <!-- Unified Dynamic Blog Layout Component -->
    <BlogPostLayout v-if="article" :article="article" />

    <!-- Hydration / Loading state while resolving article -->
    <div v-else-if="isLoading" class="max-w-xl mx-auto py-28 text-center px-4">
      <div class="w-10 h-10 border-3 border-orange-200 border-t-[#EE5102] rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-sm font-medium text-gray-600">Loading story...</p>
    </div>

    <!-- Fallback if slug not found -->
    <div v-else class="max-w-xl mx-auto py-24 text-center px-4">
      <div class="w-14 h-14 rounded-full bg-orange-50 text-[#EE5102] flex items-center justify-center mx-auto mb-4 font-bold">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
      <p class="text-sm text-gray-500 mb-6">The story you are looking for has not been published or may have been removed.</p>
      <NuxtLink to="/blog" class="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#EE5102] hover:bg-[#d84802] transition-colors shadow-sm">
        Return to All Blogs
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticles } from '~/composables/useArticles'

const route = useRoute()
const { getArticleBySlug, syncFromFirestore } = useArticles()

const isLoading = ref(true)

const article = computed(() => {
  const paramSlug = Array.isArray(route.params.slug) ? route.params.slug[0] : (route.params.slug as string)
  return getArticleBySlug(paramSlug)
})

onMounted(async () => {
  if (!article.value) {
    await syncFromFirestore().catch(() => {})
  }
  isLoading.value = false
})

useHead(() => {
  if (!article.value) {
    return {
      title: 'Article Not Found — Headline Central'
    }
  }
  const resolvedTitle = article.value.seoTitle || `${article.value.title} — Headline Central`
  const resolvedDescription = article.value.metaDescription || article.value.excerpt
  const resolvedKeywords = article.value.seoKeywords || (Array.isArray(article.value.tags) ? article.value.tags.join(', ') : '')
  const resolvedOgImage = article.value.bannerImage || article.value.featuredImage

  return {
    title: resolvedTitle,
    meta: [
      { name: 'description', content: resolvedDescription },
      { name: 'keywords', content: resolvedKeywords },
      { name: 'author', content: 'Headline Central' },
      { property: 'og:type', content: 'article' },
      { property: 'og:site_name', content: 'Headline Central' },
      { property: 'og:title', content: resolvedTitle },
      { property: 'og:description', content: resolvedDescription },
      { property: 'og:image', content: resolvedOgImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: resolvedTitle },
      { name: 'twitter:description', content: resolvedDescription },
      { name: 'twitter:image', content: resolvedOgImage }
    ]
  }
})
</script>
