<template>
  <div v-if="categoryMeta" class="py-12 bg-[#faf9f6]">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-yberry-1000">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/categories" class="hover:text-yberry-1000">Categories</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">{{ categoryMeta.name }}</span>
      </nav>

      <!-- Category Hero Banner -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm mb-12 relative overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-4">
            <span class="badge-category bg-yberry-100 text-yberry-1000 border border-yberry-300">
              Subject Focus
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-950 font-sans tracking-tight">
              {{ categoryMeta.name }}
            </h1>
            <p class="text-base sm:text-lg text-gray-600 max-w-2xl font-normal leading-relaxed">
              {{ categoryMeta.description }}
            </p>
            <div class="flex items-center space-x-4 text-xs text-gray-500 pt-2">
              <span>{{ categoryArticles.length }} Published Articles</span>
              <span>•</span>
              <span>Updated Weekly</span>
            </div>
          </div>
          <div class="lg:col-span-4">
            <img
              :src="categoryMeta.image"
              :alt="categoryMeta.name"
              class="w-full aspect-[4/3] rounded-2xl object-cover shadow-md"
            />
          </div>
        </div>
      </div>

      <!-- Category Articles Feed -->
      <div class="mb-10">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 class="text-2xl font-medium text-gray-950 font-sans tracking-tight">
            All Stories in {{ categoryMeta.name }}
          </h2>

          <!-- Sub-Categories Filter Pills -->
          <div
            v-if="categoryMeta.subCategories && categoryMeta.subCategories.length > 0"
            class="flex flex-wrap items-center gap-2"
          >
            <button
              @click="selectedSubSlug = ''"
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              :class="!selectedSubSlug ? 'bg-[#EE5102] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#EE5102]'"
            >
              All {{ categoryMeta.name }}
            </button>
            <button
              v-for="sub in categoryMeta.subCategories"
              :key="sub.id"
              @click="selectedSubSlug = sub.slug"
              type="button"
              class="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              :class="selectedSubSlug === sub.slug ? 'bg-[#EE5102] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#EE5102]'"
            >
              {{ sub.name }}
            </button>
          </div>
        </div>

        <div v-if="filteredCategoryArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="article in filteredCategoryArticles"
            :key="article.id"
            class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  :src="article.featuredImage"
                  :alt="article.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <div class="p-6">
                <div class="flex items-center space-x-2 text-xs text-gray-600 mb-2">
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

            <div class="px-6 pb-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <div class="flex items-center space-x-2.5">
                <img
                  v-if="article.author?.avatar"
                  :src="article.author.avatar"
                  :alt="article.author?.name || 'Author'"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <span class="text-xs font-medium text-gray-700">
                  {{ article.author?.name || 'Editorial Staff' }}
                </span>
              </div>

              <NuxtLink
                :to="`/blog/${article.slug}`"
                class="btn-sm-primary"
              >
                Read Story
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-xl mx-auto my-6">
          <div class="w-12 h-12 rounded-full bg-orange-100 text-[#EE5102] flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          </div>
          <p class="text-base text-gray-800 font-medium mb-1">No stories published in {{ categoryMeta.name }} yet</p>
          <p class="text-xs text-gray-500 mb-6">Our editorial team is preparing new stories for this category. Stay tuned!</p>
          <NuxtLink to="/blog" class="btn-primary !text-xs !py-2.5 !px-5">Explore All Stories</NuxtLink>
        </div>
      </div>

      <!-- Newsletter Section -->
      <NewsletterSection />
    </div>
  </div>

  <!-- Fallback -->
  <div v-else class="max-w-xl mx-auto py-24 text-center px-4">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
    <p class="text-sm text-gray-500 mb-6">The requested category does not exist.</p>
    <NuxtLink to="/categories" class="btn-primary">View Categories</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticles } from '~/composables/useArticles'

const route = useRoute()
const { getCategoryMeta, getArticlesByCategory, syncFromFirestore } = useArticles()

onMounted(async () => {
  await syncFromFirestore().catch(() => {})
})

const categorySlug = computed(() => route.params.slug as string)
const categoryMeta = computed(() => getCategoryMeta(categorySlug.value))
const categoryArticles = computed(() => getArticlesByCategory(categorySlug.value))

const selectedSubSlug = ref((route.query.sub as string) || '')

watch(
  () => route.query.sub,
  newSub => {
    selectedSubSlug.value = (newSub as string) || ''
  }
)

const filteredCategoryArticles = computed(() => {
  if (!selectedSubSlug.value) return categoryArticles.value
  return categoryArticles.value.filter(a => a.subCategorySlug === selectedSubSlug.value)
})

if (categoryMeta.value) {
  useHead({
    title: () => categoryMeta.value?.seoTitle || `${categoryMeta.value?.name} — Headline Central`,
    meta: [
      { name: 'description', content: () => categoryMeta.value?.metaDescription || categoryMeta.value?.description || '' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Headline Central' },
      { property: 'og:title', content: () => categoryMeta.value?.seoTitle || `${categoryMeta.value?.name} — Headline Central` },
      { property: 'og:description', content: () => categoryMeta.value?.metaDescription || categoryMeta.value?.description || '' },
      { property: 'og:image', content: () => categoryMeta.value?.image || '' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  })
}
</script>

