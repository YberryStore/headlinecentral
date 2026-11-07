<template>
  <div>
    <!-- Unified Dynamic Blog Layout Component -->
    <BlogPostLayout v-if="article" :article="article" />

    <!-- Fallback if slug not found -->
    <div v-else class="max-w-xl mx-auto py-24 text-center px-4">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
      <p class="text-sm text-gray-500 mb-6">The story you are looking for may have been moved or archived.</p>
      <NuxtLink to="/blog" class="btn-primary">Return to Articles</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useArticles } from '~/composables/useArticles'

const route = useRoute()
const { getArticleBySlug } = useArticles()

const article = getArticleBySlug(route.params.slug as string)

if (article) {
  useHead({
    title: `${article.title} — Headline Central`,
    meta: [
      { name: 'description', content: article.excerpt },
      { property: 'og:title', content: article.title },
      { property: 'og:description', content: article.excerpt },
      { property: 'og:image', content: article.bannerImage || article.featuredImage },
      { name: 'author', content: article.author?.name || 'Headline Central' }
    ]
  })
}
</script>
