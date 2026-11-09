<template>
  <div>
    <!-- Featured Hero Banner (Renders CMS Hero Banner or featured article fallback) -->
    <HeroBanner :article="featuredArticle" />

    <!-- Popular Articles (Renders only when blogs are loaded) -->
    <PopularArticles v-if="popularArticles.length > 0" :articles="popularArticles" />

    <!-- Main Content Categories (Renders only when user has added categories) -->
    <CategoryShowcase v-if="categories.length > 0" :categories="categories" />

    <!-- Latest Articles (Renders only when blogs are loaded) -->
    <ArticleGrid v-if="latestArticles.length > 0" :articles="latestArticles" />

    <!-- Empty state when no blogs have been loaded under CMS Blogs and no hero banner -->
    <section
      v-if="articles.length === 0 && activeBanners.length === 0"
      class="py-16 bg-white border-b border-gray-100"
    >
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="max-w-md mx-auto p-8 rounded-3xl bg-gray-50 border border-gray-100">
          <div class="w-12 h-12 rounded-full bg-[#EE5102]/10 text-[#EE5102] flex items-center justify-center mx-auto mb-3 font-semibold text-sm">
            HC
          </div>
          <h3 class="text-base font-semibold text-gray-900 mb-1">No Published Blogs Yet</h3>
          <p class="text-xs text-gray-500 mb-5 leading-relaxed">
            Stories published from the CMS under Blogs will automatically appear here on the homepage.
          </p>
          <NuxtLink
            to="/cms"
            class="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-medium text-white bg-[#EE5102] hover:bg-[#d84802] transition-colors shadow-sm"
          >
            Open CMS &bull; Blogs
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useArticles } from '~/composables/useArticles'
import { useBanners } from '~/composables/useBanners'
import { useSiteSeo } from '~/composables/useSiteSeo'

const {
  articles,
  getFeaturedArticle,
  getPopularArticles,
  getLatestArticles,
  categories,
  syncFromFirestore
} = useArticles()

const { activeBanners, syncFromFirestore: syncBanners } = useBanners()
const { applyPageSeo } = useSiteSeo()

const featuredArticle = computed(() => getFeaturedArticle())
const popularArticles = computed(() => getPopularArticles())
const latestArticles = computed(() => getLatestArticles(6))

onMounted(async () => {
  await Promise.allSettled([
    syncFromFirestore(),
    syncBanners()
  ])
})

applyPageSeo('home')
</script>

