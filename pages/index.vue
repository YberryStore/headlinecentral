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
import { useSiteSeo } from '~/composables/useSiteSeo'

const {
  getFeaturedArticle,
  getPopularArticles,
  getLatestArticles,
  categories
} = useArticles()

const { applyPageSeo } = useSiteSeo()

const featuredArticle = getFeaturedArticle()
const popularArticles = getPopularArticles()
const latestArticles = getLatestArticles(6)

applyPageSeo('home')
</script>

