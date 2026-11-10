<template>
  <section v-if="articles && articles.length > 0" class="py-12 bg-gray-50/60 border-b border-gray-100">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-3">
          <div class="w-2.5 h-6 rounded-full bg-yberry-1000"></div>
          <h2 class="text-2xl font-semibold text-gray-950 font-sans tracking-tight">
            Popular Right Now
          </h2>
        </div>
        <NuxtLink to="/blog" class="text-sm font-medium text-yberry-1000 hover:text-yberry-800 transition-colors flex items-center space-x-1">
          <span>View Leaderboard</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </NuxtLink>
      </div>

      <!-- Popular Articles 4-Column Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <article
          v-for="(item, index) in articles.slice(0, 4)"
          :key="item.id"
          class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
        >
          <!-- Top row: Rank badge & Category -->
          <div class="flex items-center justify-between mb-3">
            <span class="w-7 h-7 rounded-full bg-yberry-100 text-yberry-1000 font-bold text-xs flex items-center justify-center">
              0{{ index + 1 }}
            </span>
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {{ item.category }}
            </span>
          </div>

          <!-- Thumbnail -->
          <NuxtLink :to="`/blog/${item.slug}`" class="block aspect-video rounded-xl overflow-hidden mb-3.5 bg-gray-100">
            <img
              :src="useAsset(item.featuredImage)"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </NuxtLink>

          <!-- Title -->
          <h3 class="text-base font-medium text-gray-900 group-hover:text-yberry-1000 transition-colors line-clamp-2 mb-2 font-sans">
            <NuxtLink :to="`/blog/${item.slug}`">
              {{ item.title }}
            </NuxtLink>
          </h3>

          <!-- Footer meta -->
          <div class="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>{{ item.readTime }}</span>
            <span class="flex items-center space-x-1" :title="`${getViewsCount(item)} total views`">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>{{ formatDisplayViews(item) }}</span>
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/composables/useArticles'
import { useAnalytics } from '~/composables/useAnalytics'

defineProps<{
  articles: Article[]
}>()

const { getArticleTotalViews, getArticleUniqueViews } = useAnalytics()

const getViewsCount = (item: Article): number => {
  const realTotal = getArticleTotalViews(item.slug || item.id)
  const realUnique = getArticleUniqueViews(item.slug || item.id)
  if (realTotal > 0) return realTotal
  if (realUnique > 0) return realUnique
  return typeof item.views === 'number' && item.views < 5000 ? Math.max(1, item.views) : 1
}

const formatDisplayViews = (item: Article): string => {
  const count = getViewsCount(item)
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return String(count)
}
</script>

