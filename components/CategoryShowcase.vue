<template>
  <section class="py-14 bg-white border-b border-gray-100">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs uppercase tracking-widest font-semibold text-yberry-1000 block mb-2">
          Curated Hubs
        </span>
        <h2 class="text-3xl sm:text-4xl font-medium text-gray-950 font-sans tracking-tight">
          Explore by Category
        </h2>
        <p class="text-base text-gray-600 mt-3">
          Explore our dedicated subject coverage and in-depth investigations.
        </p>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/categories/${cat.slug}`"
          class="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 border border-gray-100"
        >
          <!-- Background Image with Overlay -->
          <img
            :src="cat.image"
            :alt="cat.name"
            class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-60"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>

          <!-- Content overlay -->
          <div class="relative z-10 space-y-2">
            <div class="flex items-center justify-between">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                Explore Topic
              </span>
              <span class="text-xs text-white/80 font-medium">
                {{ getArticleCount(cat.slug) }} Articles
              </span>
            </div>

            <h3 class="text-2xl font-medium text-white group-hover:text-yberry-300 transition-colors font-sans">
              {{ cat.name }}
            </h3>

            <p class="text-xs text-gray-300 line-clamp-2 leading-relaxed">
              {{ cat.description }}
            </p>

            <div class="pt-2 flex items-center space-x-1.5 text-xs font-semibold text-yberry-300 group-hover:translate-x-1 transition-transform">
              <span>Browse Hub</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useArticles, type CategoryMeta } from '~/composables/useArticles'

defineProps<{
  categories: CategoryMeta[]
}>()

const { articles } = useArticles()

const getArticleCount = (categorySlug: string) => {
  return articles.filter(a => a.categorySlug === categorySlug).length
}
</script>

