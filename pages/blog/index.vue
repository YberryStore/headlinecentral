<template>
  <div class="py-12 bg-[#faf9f6]">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-xs text-gray-500 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-yberry-1000">Home</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-semibold">All Articles</span>
      </nav>

      <!-- Page Header -->
      <div class="max-w-3xl mb-10">
        <span class="text-xs uppercase tracking-widest font-semibold text-yberry-1000 block mb-2">
          The Full Archive
        </span>
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-medium text-gray-950 font-sans tracking-tight mb-4">
          All Published Stories
        </h1>
        <p class="text-base text-gray-600 leading-relaxed font-normal">
          Explore our complete catalogue of investigated stories, technological breakthroughs, and architectural retrospectives.
        </p>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Category filter pills -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="selectedCategory = 'all'"
            class="px-4 py-2 rounded-full text-xs font-semibold transition-colors"
            :class="selectedCategory === 'all' ? 'bg-yberry-1000 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            All ({{ articles.length }})
          </button>
          <button
            v-for="cat in categories"
            :key="cat.slug"
            @click="selectedCategory = cat.slug"
            class="px-4 py-2 rounded-full text-xs font-semibold transition-colors"
            :class="selectedCategory === cat.slug ? 'bg-yberry-1000 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ cat.name }} ({{ countCategory(cat.slug) }})
          </button>
        </div>

        <!-- Search input -->
        <div class="relative w-full md:w-72">
          <input
            v-model="query"
            type="text"
            placeholder="Search within archive..."
            class="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-yberry-1000 focus:bg-white text-gray-900 placeholder-gray-400"
          />
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Article Grid -->
      <div v-if="filteredList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in filteredList"
          :key="article.id"
          class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
        >
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

            <div class="p-6">
              <div class="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                <span>{{ article.publishedAt }}</span>
                <span>•</span>
                <span>{{ article.readTime }}</span>
              </div>

              <h2 class="text-xl font-medium text-gray-950 group-hover:text-yberry-1000 transition-colors line-clamp-2 leading-snug font-sans mb-3">
                <NuxtLink :to="`/blog/${article.slug}`">
                  {{ article.title }}
                </NuxtLink>
              </h2>

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
              Read
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8">
        <div class="w-16 h-16 rounded-full bg-orange-50 text-[#EE5102] flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
        </div>
        <template v-if="articles.length === 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">No blogs published yet</h3>
          <p class="text-sm text-gray-500 mb-6">Articles published under Blogs in the CMS will appear here in the archive.</p>
          <NuxtLink to="/cms" class="btn-primary !py-2.5 !px-6 text-xs">Open CMS &bull; Blogs</NuxtLink>
        </template>
        <template v-else>
          <h3 class="text-lg font-semibold text-gray-900 mb-1">No articles matched your criteria</h3>
          <p class="text-sm text-gray-500 mb-6">Try refining your keyword search or switching to another category.</p>
          <button @click="resetFilters" class="btn-primary !py-2.5 !px-6 text-xs">
            Reset All Filters
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticles } from '~/composables/useArticles'
import { useSiteSeo } from '~/composables/useSiteSeo'

const { articles, categories, syncFromFirestore } = useArticles()
const { applyPageSeo } = useSiteSeo()

const selectedCategory = ref('all')
const query = ref('')

onMounted(async () => {
  await syncFromFirestore().catch(() => {})
})

const countCategory = (slug: string) => {
  return articles.filter(a => a.categorySlug === slug).length
}

const resetFilters = () => {
  selectedCategory.value = 'all'
  query.value = ''
}

const filteredList = computed(() => {
  return articles.filter(a => {
    const matchesCat = selectedCategory.value === 'all' || a.categorySlug === selectedCategory.value
    const matchesQuery = !query.value.trim() || 
      a.title.toLowerCase().includes(query.value.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(query.value.toLowerCase()) ||
      (Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase().includes(query.value.toLowerCase())))
    return matchesCat && matchesQuery
  })
})

applyPageSeo('blog')
</script>

