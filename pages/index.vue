<template>
  <div>
    <!-- Featured Hero Banner -->
    <HeroBanner :article="featuredArticle" />

    <!-- Popular Articles -->
    <PopularArticles :articles="popularArticles" />

    <!-- Main Content Categories -->
    <CategoryShowcase :categories="categories" />

    <!-- Latest Articles -->
    <ArticleGrid :articles="latestArticles" />

    <!-- Newsletter Subscription -->
    <NewsletterSection />
  </div>
</template>

<script setup lang="ts">
import { useArticles } from '~/composables/useArticles'

const {
  getFeaturedArticle,
  getPopularArticles,
  getLatestArticles,
  categories
} = useArticles()

const featuredArticle = getFeaturedArticle()
const popularArticles = getPopularArticles()
const latestArticles = getLatestArticles(6)

useHead({
  title: 'Headline Central — Essential Stories Across Technology & Digital Culture',
  meta: [
    { name: 'description', content: 'Headline Central brings you essential headlines, investigative technical analysis, hardware retrospectives, and digital architecture coverage.' }
  ]
})
</script>

