<template>
  <section v-if="articles && articles.length > 0" class="py-14 bg-gray-50/50 border-b border-gray-100">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-gray-200">
        <div>
          <span class="text-xs font-semibold uppercase tracking-widest text-yberry-1000 block mb-1">
            Fresh Off The Press
          </span>
          <h2 class="text-3xl font-medium text-gray-950 font-sans tracking-tight">
            Latest Published Stories
          </h2>
        </div>
        <div class="mt-4 sm:mt-0 flex items-center space-x-2">
          <NuxtLink to="/blog" class="btn-secondary !py-2 !px-4 !text-xs font-medium">
            View All Articles
          </NuxtLink>
        </div>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in articles"
          :key="article.id"
          class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
        >
          <!-- Card Top: Image & Badge -->
          <div>
            <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img
                :src="useAsset(article.featuredImage)"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <NuxtLink
                :to="`/categories/${article.categorySlug}`"
                class="absolute top-4 left-4 badge-category bg-white/90 backdrop-blur-md text-gray-900 border border-white/60 hover:bg-yberry-1000 hover:text-white transition-colors"
              >
                {{ article.category }}
              </NuxtLink>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex items-center space-x-2 text-xs text-gray-600 mb-2.5">
                <span>{{ article.publishedAt }}</span>
                <span>•</span>
                <span>{{ article.readTime }}</span>
              </div>

              <h3 class="text-xl font-medium text-gray-950 group-hover:text-yberry-1000 transition-colors line-clamp-2 leading-snug font-sans mb-3">
                <NuxtLink :to="`/blog/${article.slug}`">
                  {{ article.title }}
                </NuxtLink>
              </h3>

              <p class="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {{ article.excerpt }}
              </p>
            </div>
          </div>

          <!-- Card Bottom: Author & Read Link -->
          <div class="px-6 pb-6 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div class="flex items-center space-x-2.5">
              <img
                :src="article.author.avatar"
                :alt="article.author.name"
                class="w-8 h-8 rounded-full object-cover"
              />
              <span class="text-xs font-medium text-gray-700">
                {{ article.author.name }}
              </span>
            </div>

            <NuxtLink
              :to="`/blog/${article.slug}`"
              class="text-xs font-semibold text-yberry-1000 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1"
            >
              <span>Read</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~/composables/useArticles'

defineProps<{
  articles: Article[]
}>()
</script>

